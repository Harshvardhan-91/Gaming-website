const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const Listing = require('../models/Listing');
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: 'uploads/listings/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

// Validation middleware
const listingValidation = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ min: 10 }).withMessage('Title must be at least 10 characters'),
  body('gameType').notEmpty().withMessage('Game type is required')
    .isIn(['Valorant', 'CSGO', 'PUBG', 'Fortnite', 'League of Legends', 'Other'])
    .withMessage('Invalid game type'),
  body('price').isNumeric().withMessage('Price must be a number')
    .isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),
  body('features').isArray().withMessage('Features must be an array'),
  body('details.level').optional().isNumeric(),
  body('details.rank').optional().trim(),
  body('details.accountAge').optional().trim(),
  body('details.skins').optional().trim()
];

// Get all listings with filters
router.get('/', async (req, res) => {
  try {
    const { 
      gameType, 
      minPrice, 
      maxPrice, 
      sort = '-createdAt',
      verified,
      page = 1,
      limit = 10
    } = req.query;

    const query = { status: 'active' };
    if (gameType) query.gameType = gameType;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }
    if (verified) query.verified = verified === 'true';

    const [listings, total] = await Promise.all([
      Listing.find(query)
        .populate('seller', 'name avatar rating')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
      Listing.countDocuments(query)
    ]);

    res.json({
      success: true,
      listings,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error fetching listings' 
    });
  }
});

// Create new listing
router.post('/', [
  auth,
  upload.array('images', 6),
  listingValidation
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    if (!req.files?.length) {
      return res.status(400).json({
        success: false,
        error: 'At least one image is required'
      });
    }

    const images = req.files.map(file => `/uploads/listings/${file.filename}`);

    const listing = new Listing({
      ...req.body,
      seller: req.user.userId,
      images
    });

    await listing.save();

    // Add listing to user's listings
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { listings: listing._id }
    });

    const populatedListing = await listing.populate('seller', 'name avatar rating');

    res.status(201).json({
      success: true,
      listing: populatedListing
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error creating listing' 
    });
  }
});

// Get single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'name avatar rating verified createdAt')
      .populate('likes', 'id');
    
    if (!listing) {
      return res.status(404).json({ 
        success: false, 
        error: 'Listing not found' 
      });
    }

    // Increment views
    listing.views += 1;
    await listing.save();
    
    res.json({
      success: true,
      listing
    });
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error fetching listing' 
    });
  }
});

// Update listing
router.put('/:id', [auth], async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ 
        success: false, 
        error: 'Listing not found' 
      });
    }

    // Check ownership
    if (listing.seller.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized' 
      });
    }

    // Update listing
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('seller', 'name avatar rating');

    res.json({
      success: true,
      listing: updatedListing
    });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error updating listing' 
    });
  }
});

// Toggle like listing
router.post('/:id/like', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ 
        success: false, 
        error: 'Listing not found' 
      });
    }

    const isLiked = listing.likes.includes(req.user.userId);
    
    if (isLiked) {
      listing.likes.pull(req.user.userId);
    } else {
      listing.likes.push(req.user.userId);
    }

    await listing.save();

    res.json({
      success: true,
      liked: !isLiked
    });
  } catch (error) {
    console.error('Like listing error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error updating like status' 
    });
  }
});

module.exports = router;