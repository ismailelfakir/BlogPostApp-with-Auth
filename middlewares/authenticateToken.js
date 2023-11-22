const { verifyToken } = require('../config/jwt');

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token is missing.' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;  // Set the user data from the token in the request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
}

module.exports = authenticateToken;