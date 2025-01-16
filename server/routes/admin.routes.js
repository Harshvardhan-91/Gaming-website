// server/routes/admin.routes.js
const router = require('express').Router();
const User = require('../models/User');
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');

// Admin middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized as admin' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all users
router.get('/users', [auth, isAdmin], async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Delete user
router.delete('/users/:userId', [auth, isAdmin], async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    // Also delete user's listings
    await Listing.deleteMany({ seller: req.params.userId });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// Get all listings
router.get('/listings', [auth, isAdmin], async (req, res) => {
  try {
    const listings = await Listing.find().populate('seller', 'name email');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching listings' });
  }
});

// Delete listing
router.delete('/listings/:listingId', [auth, isAdmin], async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.listingId);
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting listing' });
  }
});

module.exports = router;