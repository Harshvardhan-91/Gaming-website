const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const Listing = require('../models/Listing');
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Chat = require('../models/Chat');

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

// Get all listings with filters
router.get('/', async (req, res) => {
  try {
    const { 
      gameType, 
      minPrice, 
      maxPrice, 
      sort = '-createdAt',
      verified,
      seller,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};
    
    if (gameType) query.gameType = gameType;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (verified === 'true') query.verified = true;
    if (seller) query.seller = seller;

    console.log('Query:', query); // Debug log

    const [listings, total] = await Promise.all([
      Listing.find(query)
        .populate('seller', 'name avatar rating verified')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Listing.countDocuments(query)
    ]);

    console.log('Found listings:', listings.length); // Debug log

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

// Get user's listings
router.get('/my-listings', auth, async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user.userId })
      .populate('seller', 'name avatar rating verified')
      .sort('-createdAt');

    res.json({
      success: true,
      listings
    });
  } catch (error) {
    console.error('Get my listings error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching your listings'
    });
  }
});

router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    // Check ownership or admin role
    if (listing.seller.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    // Validate status
    if (!['active', 'sold', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    listing.status = status;
    await listing.save();

    res.json({
      success: true,
      listing
    });
  } catch (error) {
    console.error('Update listing status error:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating listing status'
    });
  }
});

// Delete listing
router.delete('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    // Check ownership or admin role
    if (listing.seller.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    // Delete images from Cloudinary
    for (const imageUrl of listing.images) {
      try {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`game-listings/${publicId}`);
      } catch (e) {
        console.error('Error deleting image from Cloudinary:', e);
      }
    }

    // Remove listing from user's listings array
    await User.findByIdAndUpdate(listing.seller, {
      $pull: { listings: listing._id }
    });

    // Delete the listing
    await listing.deleteOne();

    res.json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting listing'
    });
  }
});

// Get listing statistics
router.get('/:id/stats', auth, async (req, res) => {
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

    const stats = {
      views: listing.views,
      likes: listing.likes.length,
      inquiries: await Chat.countDocuments({ listing: listing._id }),
      status: listing.status,
      createdAt: listing.createdAt
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get listing stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching listing statistics'
    });
  }
});


module.exports = router;