const router = require('express').Router();
const User = require('../models/User');
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');
const adminController = require('../controllers/admin.controller');
const isAdmin = require('../middleware/isAdmin');



// Dashboard Stats
router.get('/dashboard/stats', [auth, isAdmin], adminController.getDashboardStats);

// User Management
router.get('/users', [auth, isAdmin], adminController.getAllUsers);
router.patch('/users/:id', [auth, isAdmin], adminController.updateUser);
router.delete('/users/:id', [auth, isAdmin], adminController.deleteUser);

// Report Management
router.get('/reports', [auth, isAdmin], adminController.getAllReports);
router.patch('/reports/:id', [auth, isAdmin], adminController.updateReport);

// Listing Management
router.get('/listings', [auth, isAdmin], adminController.getAllListings);
router.delete('/listings/:id', [auth, isAdmin], adminController.deleteListing);

// Get admin dashboard stats
router.get('/stats', [auth, isAdmin], async (req, res) => {
  try {
    const stats = {
      users: await User.countDocuments(),
      listings: await Listing.countDocuments(),
      activeListings: await Listing.countDocuments({ status: 'active' }),
      reportedListings: await Listing.countDocuments({ status: 'reported' })
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching stats' });
  }
});

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
router.delete('/users/:id', [auth, isAdmin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user's listings
    await Listing.deleteMany({ seller: user._id });
    
    // Delete user
    await user.deleteOne();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// Update user (ban/unban, change role)
router.patch('/users/:id', [auth, isAdmin], async (req, res) => {
  try {
    const updates = {};
    if (req.body.status) updates.status = req.body.status;
    if (req.body.role) updates.role = req.body.role;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Get all listings for admin
router.get('/listings', [auth, isAdmin], async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate('seller', 'name email')
      .sort('-createdAt');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching listings' });
  }
});

// Delete listing
router.delete('/listings/:id', [auth, isAdmin], async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Remove listing from user's listings array
    await User.findByIdAndUpdate(listing.seller, {
      $pull: { listings: listing._id }
    });

    await listing.deleteOne();
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting listing' });
  }
});



module.exports = router;