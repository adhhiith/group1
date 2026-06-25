const express = require('express');
const router = express.Router();
const dbHelper = require('../utils/dbHelper');
const { authenticate, adminOnly } = require('../middleware/auth');

// Get all statistics
router.get('/stats', authenticate, adminOnly, async (req, res) => {
  try {
    const stats = await dbHelper.getStats();
    res.json(stats);
  } catch (err) {
    console.error('Fetch stats error:', err);
    res.status(500).json({ message: 'Server error retrieving system stats.' });
  }
});

// List all users
router.get('/users', authenticate, adminOnly, async (req, res) => {
  try {
    const users = await dbHelper.listUsers();
    // Exclude passwords
    const sanitizedUsers = users.map(u => ({
      id: u._id || u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      isBanned: u.isBanned || false,
      createdAt: u.createdAt
    }));
    res.json(sanitizedUsers);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ message: 'Server error retrieving user list.' });
  }
});

// Toggle Ban/Suspend User
router.put('/users/:id/ban', authenticate, adminOnly, async (req, res) => {
  try {
    const { isBanned } = req.body;
    const userToUpdate = await dbHelper.findUserById(req.params.id);

    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (userToUpdate.role === 'admin') {
      return res.status(400).json({ message: 'Cannot ban or suspend administrator accounts.' });
    }

    const updatedUser = await dbHelper.updateUser(req.params.id, { isBanned: !!isBanned });
    
    res.json({
      message: `User account has been ${!!isBanned ? 'suspended' : 're-activated'}.`,
      user: {
        id: updatedUser._id || updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        isBanned: updatedUser.isBanned
      }
    });
  } catch (err) {
    console.error('Toggle ban error:', err);
    res.status(500).json({ message: 'Server error updating user ban status.' });
  }
});

// List all orders (Admin only)
router.get('/orders', authenticate, adminOnly, async (req, res) => {
  try {
    const orders = await dbHelper.findOrders({});
    res.json(orders);
  } catch (err) {
    console.error('Fetch orders admin error:', err);
    res.status(500).json({ message: 'Server error retrieving order logs.' });
  }
});

module.exports = router;
