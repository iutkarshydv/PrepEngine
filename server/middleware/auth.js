const jwt = require('jsonwebtoken');
const config = require('../config');

// For development, we'll use the in-memory users array from auth.js
// Uncomment when MongoDB is available
// const User = require('../models/User');

/**
 * Authentication middleware to verify JWT tokens
 */
module.exports = function(req, res, next) {
  // Get token from header - check both x-auth-token and Authorization headers
  let token = req.header('x-auth-token');
  
  // If no x-auth-token, check Authorization header
  if (!token) {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // For development, we'll just use the user ID from the token
    // In production, we would verify the user exists in the database
    req.user = {
      id: decoded.user.id
    };
    
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
