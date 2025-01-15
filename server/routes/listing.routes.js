const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');

// Get all listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'active' })
      .populate('seller', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new listing
router.post('/', [
  auth,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('gameType').notEmpty().withMessage('Game type is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('description').trim().notEmpty().withMessage('Description is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const listing = new Listing({
      ...req.body,
      seller: req.user.userId
    });

    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'name avatar');
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    res.json(listing);
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Export the router (this is important!)
module.exports = router;