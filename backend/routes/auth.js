const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbHelper = require('../utils/dbHelper');
const { authenticate } = require('../middleware/auth');

// Register User
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role, contactDetails, profilePicture } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required.' });
    }

    // Check if email already registered
    const existingUser = await dbHelper.findUser({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await dbHelper.createUser({
      username,
      email,
      password: hashedPassword,
      role: role || 'client',
      profilePicture: profilePicture || '',
      contactDetails: contactDetails || ''
    });

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id || newUser.id },
      process.env.JWT_SECRET || 'super_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id || newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        profilePicture: newUser.profilePicture,
        contactDetails: newUser.contactDetails
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during user registration.' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await dbHelper.findUser({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: 'This user account has been suspended by an administrator.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id || user.id },
      process.env.JWT_SECRET || 'super_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id || user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        contactDetails: user.contactDetails
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// Get Current User Profile
router.get('/me', authenticate, async (req, res) => {
  res.json({
    id: req.user._id || req.user.id,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role,
    profilePicture: req.user.profilePicture,
    contactDetails: req.user.contactDetails
  });
});

// Update Profile
router.put('/me', authenticate, async (req, res) => {
  try {
    const { username, profilePicture, contactDetails } = req.body;
    const userId = req.user._id || req.user.id;

    const updatedUser = await dbHelper.updateUser(userId, {
      username: username || req.user.username,
      profilePicture: profilePicture !== undefined ? profilePicture : req.user.profilePicture,
      contactDetails: contactDetails !== undefined ? contactDetails : req.user.contactDetails
    });

    res.json({
      id: updatedUser._id || updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      profilePicture: updatedUser.profilePicture,
      contactDetails: updatedUser.contactDetails
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Server error updating profile.' });
  }
});

module.exports = router;
