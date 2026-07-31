const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');
const {
  validateRegisterInput,
  validateLoginInput,
  validateSkinProfileInput,
} = require('../utils/validators');

const SALT_ROUNDS = 10;

function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role || 'customer' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// POST /api/v1/auth/register
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const errors = validateRegisterInput({ name, email, password });
    if (errors.length) return res.status(400).json({ success: false, message: errors[0], errors });

    // Check if a user with this email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{ name, email: email.toLowerCase(), password_hash: passwordHash, role: 'customer' }])
      .select('id, name, email, role, created_at')
      .single();

    if (error) throw error;

    const token = signToken(newUser);

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

    const errors = validateLoginInput({ email, password });
    if (errors.length) return res.status(400).json({ success: false, message: errors[0], errors });

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, password_hash, role')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error) throw error;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = signToken(user);
    const { password_hash, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/auth/me  (protected — requires JWT)
async function getProfile(req, res, next) {
  try {
    const { userId } = req.user;

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .eq('id', userId)
      .maybeSingle();

    if (userError) throw userError;
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const { data: skinProfile, error: profileError } = await supabase
      .from('skin_profiles')
      .select('skin_type, concerns, allergens')
      .eq('user_id', userId)
      .maybeSingle();

    if (profileError) throw profileError;

    return res.status(200).json({
      success: true,
      user,
      skinProfile: skinProfile || null,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/auth/skin-quiz  (protected — requires JWT)
async function submitSkinQuiz(req, res, next) {
  try {
    const { userId } = req.user;
    const { skinType, concerns, allergens } = req.body;

    const errors = validateSkinProfileInput({ skinType, concerns, allergens });
    if (errors.length) return res.status(400).json({ success: false, message: errors[0], errors });

    // Upsert: one skin profile per user (matches the unique user_id in the ERD)
    const { data, error } = await supabase
      .from('skin_profiles')
      .upsert(
        {
          user_id: userId,
          skin_type: skinType.toLowerCase(),
          concerns: concerns || [],
          allergens: allergens || [],
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: 'Skin profile saved successfully.',
      skinProfile: data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getProfile, submitSkinQuiz };
