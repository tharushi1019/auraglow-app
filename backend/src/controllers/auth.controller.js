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

// In-memory fallback user store for local development when Supabase DB table is missing
const mockUsersStore = [
  {
    id: 'usr-admin-001',
    name: 'Tharushi Admin',
    email: 'admin@auraglow.com',
    password_hash: bcrypt.hashSync('Admin@AuraGlow2026', 10),
    role: 'admin',
    created_at: new Date().toISOString(),
  },
  {
    id: 'usr-customer-001',
    name: 'Demo Customer',
    email: 'demo@auraglow.com',
    password_hash: bcrypt.hashSync('Customer@123', 10),
    role: 'customer',
    created_at: new Date().toISOString(),
  },
];

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

    const errors = validateRegisterInput({ name, email, password });
    if (errors.length) return res.status(400).json({ success: false, message: errors[0], errors });

    const normalizedEmail = email.toLowerCase();
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Try Supabase first
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (existingUser) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      }

      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{ name, email: normalizedEmail, password_hash: passwordHash, role: 'customer' }])
        .select('id, name, email, role, created_at')
        .single();

      if (!error && newUser) {
        const token = signToken(newUser);
        // Fire welcome email asynchronously — don't block response
        sendWelcomeEmail(newUser).catch(e => console.warn('[Email] Welcome email error:', e.message));
        return res.status(201).json({
          success: true,
          message: 'Account created successfully.',
          token,
          user: newUser,
        });
      }
    } catch (sbErr) {
      console.warn('⚠️ Supabase register error, falling back to local store:', sbErr.message);
    }

    // Fallback to in-memory mock store if Supabase table isn't ready
    const existingMock = mockUsersStore.find(u => u.email === normalizedEmail);
    if (existingMock) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email: normalizedEmail,
      password_hash: passwordHash,
      role: 'customer',
      created_at: new Date().toISOString(),
    };
    mockUsersStore.push(newUser);

    const token = signToken(newUser);
    const { password_hash, ...safeUser } = newUser;

    // Fire welcome email asynchronously — don't block response
    sendWelcomeEmail(safeUser).catch(e => console.warn('[Email] Welcome email error:', e.message));

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const errors = validateLoginInput({ email, password });
    if (errors.length) return res.status(400).json({ success: false, message: errors[0], errors });

    const normalizedEmail = email.toLowerCase();

    // Try Supabase first
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, email, password_hash, role, created_at')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (!error && user) {
        const passwordMatches = await bcrypt.compare(password, user.password_hash);
        if (passwordMatches) {
          const token = signToken(user);
          const { password_hash, ...safeUser } = user;

          // Also fetch skin profile for instant UI sync on login
          let userSkinProfile = mockSkinProfilesStore[user.id] || null;
          try {
            const { data: spData } = await supabase
              .from('skin_profiles')
              .select('skin_type, concerns, allergens, skin_tone, undertone')
              .eq('user_id', user.id)
              .maybeSingle();
            if (spData) userSkinProfile = spData;
          } catch (spErr) {
            console.warn('[Login] Skin profile fetch note:', spErr.message);
          }

          return res.status(200).json({
            success: true,
            message: 'Logged in successfully.',
            token,
            user: safeUser,
            skinProfile: userSkinProfile,
          });
        } else {
          return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
      }
    } catch (sbErr) {
      console.warn('⚠️ Supabase login error, falling back to local store:', sbErr.message);
    }

    // Fallback to in-memory user store
    const mockUser = mockUsersStore.find(u => u.email === normalizedEmail);
    if (!mockUser) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const passwordMatches = await bcrypt.compare(password, mockUser.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = signToken(mockUser);
    const { password_hash, ...safeUser } = mockUser;

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: safeUser,
      skinProfile: mockSkinProfilesStore[mockUser.id] || null,
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

      // If not found by uid, attempt lookup by email
      if (!user && userEmail) {
        const { data: userByEmail } = await supabase
          .from('users')
          .select('id, name, email, role, created_at')
          .eq('email', userEmail)
          .maybeSingle();
        if (userByEmail) user = userByEmail;
      }

      if (user) {
        const resolvedUserId = user.id;
        const { data: skinProfile } = await supabase
          .from('skin_profiles')
          .select('skin_type, concerns, allergens, skin_tone, undertone')
          .eq('user_id', resolvedUserId)
          .maybeSingle();

        return res.status(200).json({
          success: true,
          user,
          skinProfile: skinProfile || mockSkinProfilesStore[resolvedUserId] || null,
        });
      }
    } catch (sbErr) {
      console.warn('⚠️ Supabase profile error, falling back to local store:', sbErr.message);
    }

    // Fallback user store
    const mockUser = mockUsersStore.find(u => u.id === uid) || {
      id: uid,
      name: req.user.name || 'AuraGlow User',
      email: req.user.email,
      role: req.user.role || 'customer',
      created_at: new Date().toISOString(),
    };

    return res.status(200).json({
      success: true,
      user: mockUser,
      skinProfile: mockSkinProfilesStore[uid] || null,
    });
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

