const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegisterInput({ name, email, password }) {
  const errors = [];
  if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters.');
  if (!email || !EMAIL_REGEX.test(email)) errors.push('Please provide a valid email address.');
  if (!password || password.length < 8) errors.push('Password must be at least 8 characters.');
  return errors;
}

function validateLoginInput({ email, password }) {
  const errors = [];
  if (!email || !EMAIL_REGEX.test(email)) errors.push('Please provide a valid email address.');
  if (!password) errors.push('Password is required.');
  return errors;
}

function validateSkinProfileInput({ skinType, concerns, allergens }) {
  const errors = [];
  const allowedSkinTypes = ['oily', 'dry', 'combination', 'normal', 'sensitive'];
  if (!skinType || !allowedSkinTypes.includes(skinType.toLowerCase())) {
    errors.push(`Skin type must be one of: ${allowedSkinTypes.join(', ')}.`);
  }
  if (concerns && !Array.isArray(concerns)) errors.push('Concerns must be a list.');
  if (allergens && !Array.isArray(allergens)) errors.push('Allergens must be a list.');
  return errors;
}

module.exports = { validateRegisterInput, validateLoginInput, validateSkinProfileInput };
