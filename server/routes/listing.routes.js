const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const Listing = require('../models/Listing');
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'game-listings',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }
  }
});

// Create new listing
router.post('/', [auth, upload.array('images', 6)], async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Files:', req.files);
    console.log('User ID:', req.user.userId);

    if (!req.body.title || !req.body.gameType || !req.body.price || !req.body.description) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    if (!req.files?.length) {
      return res.status(400).json({
        success: false,
        error: 'At least one image is required'
      });
    }

    // Get Cloudinary URLs from uploaded files
    const images = req.files.map(file => file.path);

    // Parse features if present
    let features = [];
    try {
      features = req.body.features ? JSON.parse(req.body.features) : [];
    } catch (e) {
      console.error('Error parsing features:', e);
      features = [];
    }

    const listingData = {
      title: req.body.title,
      gameType: req.body.gameType,
      price: Number(req.body.price),
      description: req.body.description,
      features: features,
      details: {
        level: req.body['details.level'] || '',
        rank: req.body['details.rank'] || '',
        accountAge: req.body['details.accountAge'] || '',
        skins: req.body['details.skins'] || ''
      },
      seller: req.user.userId,
      images
    };

    console.log('Creating listing with data:', listingData);

    const listing = new Listing(listingData);
    await listing.save();

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
    // If there's an error, we might want to delete the uploaded images from Cloudinary
    if (req.files) {
      for (const file of req.files) {
        try {
          const publicId = file.filename; // This might need adjustment based on your Cloudinary setup
          await cloudinary.uploader.destroy(publicId);
        } catch (e) {
          console.error('Error deleting file from Cloudinary:', e);
        }
      }
    }
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Error creating listing' 
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