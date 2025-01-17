// server/models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['listing', 'user', 'chat'],
    required: true
  },
  reportedItem: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'type',  // Dynamic reference based on type
    required: true
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'resolved', 'dismissed'],
    default: 'pending'
  },
  adminNotes: String,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: Date
}, {
  timestamps: true
});

// Add indexes for better query performance
reportSchema.index({ type: 1, status: 1 });
reportSchema.index({ reportedItem: 1 });
reportSchema.index({ reporter: 1 });

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;