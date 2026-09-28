const jwt = require('jsonwebtoken');

const generateToken = (userId, role = 'student') => {
  const secret = process.env.JWT_SECRET || 'super_secret_careerpilot_jwt_key_2026_dev';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ id: userId, role }, secret, { expiresIn });
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'super_secret_careerpilot_jwt_key_2026_dev';
  return jwt.verify(token, secret);
};

module.exports = { generateToken, verifyToken };
