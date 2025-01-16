const User = require('../models/User');
const cloudinary = require('../utils/cloudinary');

const profileController = {
  // Get user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId)
        .select('-password')
        .populate('listings');

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        user: {
          ...user.toObject(),
          profileCompletion: user.getProfileCompletion()
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get profile'
      });
    }
  },

  // Update profile
  updateProfile: async (req, res) => {
    try {
      const updates = {};
      const allowedUpdates = [
        'name', 'bio', 'phone', 'location', 
        'socialLinks', 'preferences'
      ];

      Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key];
        }
      });

      const user = await User.findByIdAndUpdate(
        req.user.userId,
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
        user: {
          ...user.toObject(),
          profileCompletion: user.getProfileCompletion()
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile'
      });
    }
  },

  // Update avatar
  updateAvatar: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      const user = await User.findById(req.user.userId);
      const oldAvatar = user.avatar;

      // Upload new avatar to Cloudinary
      const result = await cloudinary.uploadToCloudinary(
        req.file.path,
        'user-avatars'
      );

      // Update user with new avatar URL
      const updatedUser = await User.findByIdAndUpdate(
        req.user.userId,
        { 
          $set: { avatar: result.secure_url }
        },
        { new: true }
      ).select('-password');

      // Delete old avatar from Cloudinary if it exists
      if (oldAvatar) {
        try {
          const publicId = oldAvatar.split('/').pop().split('.')[0];
          await cloudinary.deleteFromCloudinary(publicId);
        } catch (error) {
          console.error('Error deleting old avatar:', error);
        }
      }

      res.json({
        success: true,
        user: {
          ...updatedUser.toObject(),
          profileCompletion: updatedUser.getProfileCompletion()
        }
      });
    } catch (error) {
      console.error('Update avatar error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update avatar'
      });
    }
  },

  // Update privacy settings
  updatePrivacySettings: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user.userId,
        { 
          $set: { 
            'preferences.privacy': req.body 
          }
        },
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
        user: {
          ...user.toObject(),
          profileCompletion: user.getProfileCompletion()
        }
      });
    } catch (error) {
      console.error('Update privacy settings error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update privacy settings'
      });
    }
  },

  // Get public profile
  getPublicProfile: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .select('-password')
        .populate('listings');

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        profile: user.getPublicProfile()
      });
    } catch (error) {
      console.error('Get public profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get profile'
      });
    }
  }
};

module.exports = profileController;