const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  attachments: [{
    type: String, // URLs to attached files
    default: []
  }]
}, {
  timestamps: true
});

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  messages: [messageSchema],
  lastMessage: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'blocked'],
    default: 'open'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
chatSchema.index({ participants: 1 });
chatSchema.index({ listing: 1 });
chatSchema.index({ lastMessage: -1 });
chatSchema.index({ 'messages.sender': 1 });
chatSchema.index({ 'messages.read': 1 });

// Update lastMessage timestamp when new message is added
chatSchema.pre('save', function(next) {
  if (this.messages && this.messages.length > 0) {
    this.lastMessage = this.messages[this.messages.length - 1].createdAt;
  }
  next();
});

// Method to get unread messages count for a user
chatSchema.methods.getUnreadCount = function(userId) {
  return this.messages.filter(msg => 
    msg.sender.toString() !== userId && !msg.read
  ).length;
};

// Method to mark all messages as read for a user
chatSchema.methods.markAsRead = function(userId) {
  this.messages.forEach(message => {
    if (message.sender.toString() !== userId) {
      message.read = true;
    }
  });
  return this.save();
};

// Method to check if a user is a participant
chatSchema.methods.isParticipant = function(userId) {
  return this.participants.some(p => p.toString() === userId.toString());
};

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;