const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const auth = require('../middleware/auth');

// For development, we'll use an in-memory users array instead of MongoDB
// This is just for development and testing purposes
const users = require('../data/users');

// Uncomment when MongoDB is available
// const User = require('../models/User');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists in our in-memory array
    const userExists = users.find(user => user.email === email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      savedCourses: [],
      savedNotes: [],
      savedSyllabus: [],
      savedPapers: []
    };

    // Add user to in-memory array
    users.push(user);
    console.log(`User registered: ${email}`);

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign token
    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpiration },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists in our in-memory array
    const user = users.find(user => user.email === email);
    if (!user) {
      // For development, create a demo user if none exists
      if (email === 'demo@example.com' && password === 'password') {
        // Create a demo user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password', salt);
        
        const demoUser = {
          id: 'demo123',
          name: 'Demo User',
          email: 'demo@example.com',
          password: hashedPassword,
          savedCourses: [],
          savedNotes: [],
          savedSyllabus: [],
          savedPapers: []
        };
        
        users.push(demoUser);
        console.log('Demo user created for testing');
        
        // Create JWT payload for demo user
        const payload = {
          user: {
            id: demoUser.id
          }
        };
        
        // Sign token for demo user
        return jwt.sign(
          payload,
          config.jwtSecret,
          { expiresIn: config.jwtExpiration },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      }
      
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign token
    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpiration },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET /api/auth/user
 * @desc    Get user data
 * @access  Private
 */
router.get('/user', auth, async (req, res) => {
  try {
    // Find user in our in-memory array
    const user = users.find(user => user.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user data without password
    const { password, ...userData } = user;
    res.json(userData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
