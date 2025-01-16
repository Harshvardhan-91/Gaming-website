const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  bio: {
    type: String,
    default: '',
    maxLength: 500
  },
  phone: {
    type: String,
    default: ''
  },
  socialLinks: {
    discord: { type: String, default: '' },
    steam: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },
  location: {
    country: { type: String, default: '' },
    city: { type: String, default: '' }
  },
  stats: {
    totalSales: { type: Number, default: 0 },
    totalPurchases: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 }
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      messages: { type: Boolean, default: true }
    },
    privacy: {
      showEmail: { type: Boolean, default: false },
      showPhone: { type: Boolean, default: false }
    }
  },
  listings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing'
  }],
  verificationToken: String,
  verified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'pending'],
    default: 'active'
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get profile completion percentage
userSchema.methods.getProfileCompletion = function() {
  const requiredFields = [
    'name',
    'email',
    'avatar',
    'bio',
    'phone',
    'location.country',
    'socialLinks.discord',
    'socialLinks.steam'
  ];

  const completedFields = requiredFields.filter(field => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], this);
    return value && String(value).trim() !== '';
  });

  return Math.round((completedFields.length / requiredFields.length) * 100);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const profile = this.toObject();
  
  // Remove sensitive information
  delete profile.password;
  delete profile.verificationToken;
  
  // Apply privacy settings
  if (!profile.preferences.privacy.showEmail) delete profile.email;
  if (!profile.preferences.privacy.showPhone) delete profile.phone;

  return profile;
};

const User = mongoose.model('User', userSchema);
module.exports = User;