const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { upload } = require('../utils/cloudinary');
const profileController = require('../controllers/profile.controller');

// Get profile completion percentage
const calculateProfileCompletion = (user) => {
  const fields = [
    'name',
    'email',
    'avatar',
    'phone',
    'bio',
    'socialLinks'
  ];
  
  const completedFields = fields.filter(field => {
    if (field === 'socialLinks') {
      return user[field] && Object.keys(user[field]).length > 0;
    }
    return user[field] && user[field].toString().trim() !== '';
  });

  return Math.round((completedFields.length / fields.length) * 100);
};

// Validation middleware
const profileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    .withMessage('Invalid phone number format'),
  body('location').optional().isObject(),
  body('location.country').optional().isString(),
  body('location.city').optional().isString(),
  body('socialLinks').optional().isObject(),
  body('socialLinks.discord').optional().isString(),
  body('socialLinks.steam').optional().isString(),
  body('socialLinks.twitter').optional().isString()
];

// Routes
router.get('/me', auth, profileController.getProfile);
router.put('/me', [auth, ...profileValidation], profileController.updateProfile);
router.post('/avatar', [auth, upload.single('avatar')], profileController.updateAvatar);
router.put('/privacy', auth, profileController.updatePrivacySettings);
router.get('/:id', profileController.getPublicProfile);
// Get user profile
router.get('/', auth, async (req, res) => {
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

    // Calculate profile completion
    const completionPercentage = calculateProfileCompletion(user);

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        profileCompletion: completionPercentage
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    });
  }
});

// Update profile
router.put('/', [
  auth,
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('phone').optional().trim(),
  body('bio').optional().trim(),
  body('socialLinks').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const updates = {};
    const allowedUpdates = ['name', 'email', 'phone', 'bio', 'socialLinks'];
    
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

    // Calculate updated profile completion
    const completionPercentage = calculateProfileCompletion(user);

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        profileCompletion: completionPercentage
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

// Upload avatar
router.post('/avatar', [auth, upload.single('avatar')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Get the old avatar URL to delete from Cloudinary later
    const user = await User.findById(req.user.userId);
    const oldAvatar = user.avatar;

    // Update user with new avatar URL
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { 
        $set: { avatar: req.file.path }
      },
      { new: true }
    ).select('-password');

    // Delete old avatar from Cloudinary if it exists
    if (oldAvatar) {
      try {
        const publicId = oldAvatar.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`user-avatars/${publicId}`);
      } catch (error) {
        console.error('Error deleting old avatar:', error);
      }
    }

    const completionPercentage = calculateProfileCompletion(updatedUser);

    res.json({
      success: true,
      user: {
        ...updatedUser.toObject(),
        profileCompletion: completionPercentage
      }
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload avatar'
    });
  }
});

// Delete avatar
router.delete('/avatar', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (user.avatar) {
      try {
        const publicId = user.avatar.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`user-avatars/${publicId}`);
      } catch (error) {
        console.error('Error deleting avatar from Cloudinary:', error);
      }
    }

    user.avatar = '';
    await user.save();

    const completionPercentage = calculateProfileCompletion(user);

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        profileCompletion: completionPercentage
      }
    });
  } catch (error) {
    console.error('Delete avatar error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete avatar'
    });
  }
});

module.exports = router;