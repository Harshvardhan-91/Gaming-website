// server/controllers/admin.controller.js
const User = require('../models/User');
const Listing = require('../models/Listing');
const Report = require('../models/Report');

const adminController = {
  // Get dashboard stats
  getDashboardStats: async (req, res) => {
    try {
      const [
        totalUsers,
        totalListings,
        activeListings,
        pendingReports,
        totalRevenue
      ] = await Promise.all([
        User.countDocuments(),
        Listing.countDocuments(),
        Listing.countDocuments({ status: 'active' }),
        Report.countDocuments({ status: 'pending' }),
        // Assuming you have a transactions collection
        // Transaction.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }])
        0 // Placeholder for revenue
      ]);

      const stats = {
        totalUsers,
        totalListings,
        activeListings,
        pendingReports,
        totalRevenue
      };

      res.json({
        success: true,
        stats
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Error fetching dashboard stats'
      });
    }
  },

  // User Management
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find()
        .select('-password')
        .sort('-createdAt');

      res.json({
        success: true,
        users
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        error: 'Error fetching users'
      });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const user = await User.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        error: 'Error updating user'
      });
    }
  },

  // Report Management
  getAllReports: async (req, res) => {
    try {
      const reports = await Report.find()
        .populate('reporter', 'name email')
        .populate('reportedItem')
        .populate('resolvedBy', 'name')
        .sort('-createdAt');

      res.json({
        success: true,
        reports
      });
    } catch (error) {
      console.error('Get reports error:', error);
      res.status(500).json({
        success: false,
        error: 'Error fetching reports'
      });
    }
  },

  updateReport: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;

      const report = await Report.findByIdAndUpdate(
        id,
        {
          $set: {
            status,
            adminNotes,
            resolvedBy: req.user.userId,
            resolvedAt: new Date()
          }
        },
        { new: true }
      )
      .populate('reporter', 'name email')
      .populate('reportedItem')
      .populate('resolvedBy', 'name');

      if (!report) {
        return res.status(404).json({
          success: false,
          error: 'Report not found'
        });
      }

      res.json({
        success: true,
        report
      });
    } catch (error) {
      console.error('Update report error:', error);
      res.status(500).json({
        success: false,
        error: 'Error updating report'
      });
    }
  },

  // Listing Management
  getAllListings: async (req, res) => {
    try {
      const listings = await Listing.find()
        .populate('seller', 'name email')
        .sort('-createdAt');

      res.json({
        success: true,
        listings
      });
    } catch (error) {
      console.error('Get listings error:', error);
      res.status(500).json({
        success: false,
        error: 'Error fetching listings'
      });
    }
  }
};

module.exports = adminController;