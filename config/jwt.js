require("dotenv").config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.SECRET; // Change this to a secure secret key

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  generateToken,
  verifyToken
};
