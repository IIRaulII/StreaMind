const jwt = require('jsonwebtoken');

/**
 * Genera un token JWT para un usuario específico
 * @param {string} userId - El ID del usuario
 * @returns {string} Token JWT firmado
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

module.exports = generateToken;
