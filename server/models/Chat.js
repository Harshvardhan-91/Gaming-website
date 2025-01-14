//server/models/Chat.js
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
  }
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
  }
}, {
  timestamps: true
});

// Update lastMessage timestamp when new message is added
chatSchema.pre('save', function(next) {
  if (this.messages && this.messages.length > 0) {
    this.lastMessage = this.messages[this.messages.length - 1].createdAt;
  }
  next();
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;

//server/routes/chat.routes.js
const router = require('express').Router();
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get all chats for current user
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ 
      participants: req.user.userId 
    })
    .populate('participants', 'name avatar')
    .populate('listing', 'title price image')
    .sort({ lastMessage: -1 });

    res.json(chats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single chat by ID
router.get('/:chatId', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('participants', 'name avatar')
      .populate('listing', 'title price image');

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p._id.toString() === req.user.userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(chat);
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new chat
router.post('/', [
  auth,
  body('participantId').notEmpty().withMessage('Participant ID is required'),
  body('listingId').notEmpty().withMessage('Listing ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { participantId, listingId } = req.body;

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      participants: { $all: [req.user.userId, participantId] },
      listing: listingId
    });

    if (existingChat) {
      return res.status(400).json({ error: 'Chat already exists' });
    }

    const chat = new Chat({
      participants: [req.user.userId, participantId],
      listing: listingId,
      messages: []
    });

    await chat.save();

    const populatedChat = await Chat.findById(chat._id)
      .populate('participants', 'name avatar')
      .populate('listing', 'title price image');

    res.status(201).json(populatedChat);
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send message in chat
router.post('/:chatId/messages', [
  auth,
  body('content').trim().notEmpty().withMessage('Message content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Check if user is participant
    if (!chat.participants.includes(req.user.userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const newMessage = {
      sender: req.user.userId,
      content: req.body.content
    };

    chat.messages.push(newMessage);
    await chat.save();

    const populatedChat = await Chat.findById(chat._id)
      .populate('participants', 'name avatar')
      .populate('listing', 'title price image');

    // Emit socket event for real-time updates
    req.app.get('io').to(chat._id.toString()).emit('new_message', {
      chatId: chat._id,
      message: newMessage
    });

    res.json(populatedChat);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark messages as read
router.put('/:chatId/read', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Check if user is participant
    if (!chat.participants.includes(req.user.userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Mark all messages from other participant as read
    chat.messages.forEach(message => {
      if (message.sender.toString() !== req.user.userId) {
        message.read = true;
      }
    });

    await chat.save();
    res.json(chat);
  } catch (error) {
    console.error('Mark messages read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;