const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['general', 'listings', 'users', 'security', 'fees']
  },
  settings: {
    type: mongoose.Schema.Schema.Types.Mixed,
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Setting = mongoose.model('Setting', settingSchema);
module.exports = Setting;