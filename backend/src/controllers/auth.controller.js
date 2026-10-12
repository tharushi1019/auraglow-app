const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');
const {
  validateRegisterInput,
  validateLoginInput,
  validateSkinProfileInput,
} = require('../utils/validators');
const { sendWelcomeEmail, sendSkinQuizEmail } = require('../services/emailService');

const SALT_ROUNDS = 10;

const mockSkinProfilesStore = {
  'usr-customer-001': {
    skin_type: 'combination',
    concerns: ['Dullness', 'Acne'],
    allergens: ['Fragrance'],
    skin_tone: 'medium',
    undertone: 'warm',
  },
};

function signToken(user) {
  return jwt.sign(
    { id: user.id, userId: user.id, email: user.email, role: user.role || 'customer' },
    process.env.JWT_SECRET || 'auraglow-secret-key-2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// POST /api/v1/auth/register
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    const errors = validateRegisterInput({ name, email: normalizedEmail, password });
    if (errors.length) return res.status(400).json({ success: false, message: errors[0], errors });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const { data: existingUser, error: lookupError } = await supabase
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (lookupError) {
      console.error('[Auth] Registration account lookup failed:', lookupError.message);
      return res.status(503).json({ success: false, message: 'Account storage is temporarily unavailable.' });
    }
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ name, email: normalizedEmail, password_hash: passwordHash, role: 'customer' }])
      .select('id, name, email, role, created_at')
      .single();

    if (insertError || !newUser) {
      console.error('[Auth] Registration insert failed:', insertError?.message || 'No user was returned.');
      return res.status(503).json({ success: false, message: 'Unable to create an account right now.' });
    }

    const token = signToken(newUser);
    sendWelcomeEmail(newUser).catch(e => console.warn('[Email] Welcome email error:', e.message));
    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: newUser,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    const errors = validateLoginInput({ email: normalizedEmail, password });
    if (errors.length) return res.status(400).json({ success: false, message: errors[0], errors });

    const { data: user, error: lookupError } = await supabase
      .from('users')
      .select('id, name, email, password_hash, role, created_at')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (lookupError) {
      console.error('[Auth] Login account lookup failed:', lookupError.message);
      return res.status(503).json({ success: false, message: 'Account storage is temporarily unavailable.' });
    }
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = signToken(user);
    const { password_hash, ...safeUser } = user;
    let userSkinProfile = mockSkinProfilesStore[user.id] || null;
    try {
      const { data: skinProfile, error: profileError } = await supabase
        .from('skin_profiles')
        .select('skin_type, concerns, allergens, skin_tone, undertone')
        .eq('user_id', user.id)
        .maybeSingle();
      if (profileError) {
        console.warn('[Auth] Login skin profile lookup failed:', profileError.message);
      } else if (skinProfile) {
        userSkinProfile = skinProfile;
      }
    } catch (profileError) {
      console.warn('[Auth] Login skin profile lookup failed:', profileError.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: safeUser,
      skinProfile: userSkinProfile,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/auth/me  (protected — requires JWT)
async function getProfile(req, res, next) {
  try {
    const uid = req.user.userId || req.user.id;
    const userEmail = req.user.email ? req.user.email.toLowerCase() : null;

    // Try Supabase first
    try {
      let query = supabase
        .from('users')
        .select('id, name, email, role, created_at');

      if (uid) {
        query = query.eq('id', uid);
      } else if (userEmail) {
        query = query.eq('email', userEmail);
      }

      let { data: user, error: userError } = await query.maybeSingle();
      if (userError) {
        console.error('[Auth] Profile lookup failed:', userError.message);
        return res.status(503).json({ success: false, message: 'Unable to load your account right now.' });
      }

      // If not found by uid, attempt lookup by email
      if (!user && userEmail) {
        const { data: userByEmail, error: emailLookupError } = await supabase
          .from('users')
          .select('id, name, email, role, created_at')
          .eq('email', userEmail)
          .maybeSingle();
        if (emailLookupError) {
          console.error('[Auth] Profile email lookup failed:', emailLookupError.message);
          return res.status(503).json({ success: false, message: 'Unable to load your account right now.' });
        }
        if (userByEmail) user = userByEmail;
      }

      if (user) {
        const resolvedUserId = user.id;
        const { data: skinProfile, error: profileError } = await supabase
          .from('skin_profiles')
          .select('skin_type, concerns, allergens, skin_tone, undertone')
          .eq('user_id', resolvedUserId)
          .maybeSingle();
        if (profileError) console.warn('[Auth] Profile skin lookup failed:', profileError.message);

        return res.status(200).json({
          success: true,
          user,
          skinProfile: skinProfile || null,
        });
      }
    } catch (sbErr) {
      console.error('[Auth] Profile lookup failed:', sbErr.message);
      return res.status(503).json({ success: false, message: 'Unable to load your account right now.' });
    }

    return res.status(401).json({ success: false, message: 'The account associated with this token was not found.' });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/auth/skin-quiz  (protected — requires JWT)
async function submitSkinQuiz(req, res, next) {
  try {
    const { userId } = req.user;
    const rawSkinType = req.body.skinType || req.body.skin_type;
    const concerns = req.body.concerns || [];
    const allergens = req.body.allergens || [];
    const skinTone = req.body.skinTone || req.body.skin_tone || 'medium';
    const undertone = req.body.undertone || 'warm';

    const errors = validateSkinProfileInput({ skinType: rawSkinType, concerns, allergens });
    if (errors.length) return res.status(400).json({ success: false, message: errors[0], errors });

    const normalizedSkinType = rawSkinType.toLowerCase();
    // Database CHECK constraint allows: 'dry', 'oily', 'combination', 'sensitive'
    // 'normal' is mapped to 'combination' in DB column to maintain constraint compatibility
    const dbSkinType = normalizedSkinType === 'normal' ? 'combination' : normalizedSkinType;

    const profileObj = {
      user_id: userId,
      skin_type: normalizedSkinType,
      concerns,
      allergens,
      skin_tone: skinTone.toLowerCase(),
      undertone: undertone.toLowerCase(),
    };

    const dbProfileObj = {
      user_id: userId,
      skin_type: dbSkinType,
      concerns,
      allergens,
      skin_tone: skinTone.toLowerCase(),
      undertone: undertone.toLowerCase(),
    };

    // Keep memory fallback in sync
    mockSkinProfilesStore[userId] = profileObj;

    // Try Supabase first
    try {
      const { data, error } = await supabase
        .from('skin_profiles')
        .upsert(dbProfileObj, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) {
        console.warn('⚠️ Supabase skin quiz upsert notice:', error.message);
      } else if (data) {
        // Return original normalized skin type to client
        const returnProfile = { ...data, skin_type: normalizedSkinType };
        mockSkinProfilesStore[userId] = returnProfile;

        // Fire skin quiz completion email asynchronously
        const emailUser = { email: req.user.email, name: req.user.name || 'Valued Member' };
        sendSkinQuizEmail(emailUser, returnProfile).catch(e => console.warn('[Email] Skin quiz email error:', e.message));

        return res.status(200).json({
          success: true,
          message: 'Skin profile saved successfully.',
          skinProfile: returnProfile,
        });
      }
    } catch (sbErr) {
      console.warn('⚠️ Supabase skin quiz error, falling back to local store:', sbErr.message);
    }

    // Fire skin quiz completion email asynchronously
    const emailUser = { email: req.user.email, name: req.user.name || 'Valued Member' };
    sendSkinQuizEmail(emailUser, profileObj).catch(e => console.warn('[Email] Skin quiz email error:', e.message));

    return res.status(200).json({
      success: true,
      message: 'Skin profile saved successfully.',
      skinProfile: profileObj,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getProfile,
  submitSkinQuiz,
};
