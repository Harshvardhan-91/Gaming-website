const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  gameType: {
    type: String,
    required: true,
    enum: ['Valorant', 'CSGO', 'PUBG', 'Fortnite', 'League of Legends', 'Other']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  features: [{
    type: String
  }],
  details: {
    level: Number,
    rank: String,
    accountAge: String,
    skins: String
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'suspended'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add text index for search
listingSchema.index({ 
  title: 'text', 
  description: 'text', 
  gameType: 'text' 
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;