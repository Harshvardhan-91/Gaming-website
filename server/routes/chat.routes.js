const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');

// Get all chats for current user
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ 
      participants: req.user.userId,
      isActive: true
    })
    .populate('participants', 'name avatar')
    .populate('listing', 'title price images')
    .sort({ lastMessage: -1 });

    // Add unread count for each chat
    const chatsWithUnread = chats.map(chat => ({
      ...chat.toObject(),
      unreadCount: chat.getUnreadCount(req.user.userId)
    }));

    res.json(chatsWithUnread);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single chat by ID
router.get('/:chatId', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      isActive: true
    })
    .populate('participants', 'name avatar')
    .populate('listing', 'title price images');

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Check if user is participant
    if (!chat.isParticipant(req.user.userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Mark messages as read
    await chat.markAsRead(req.user.userId);

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
      listing: listingId,
      isActive: true
    });

    if (existingChat) {
      return res.json(existingChat);
    }

    // Create new chat
    const chat = new Chat({
      participants: [req.user.userId, participantId],
      listing: listingId,
      messages: []
    });

    await chat.save();

    const populatedChat = await Chat.findById(chat._id)
      .populate('participants', 'name avatar')
      .populate('listing', 'title price images');

    // Notify other participant via socket
    const io = req.app.get('io');
    io.to(participantId).emit('new_chat', populatedChat);

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

    const chat = await Chat.findOne({
      _id: req.params.chatId,
      isActive: true
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Check if user is participant
    if (!chat.isParticipant(req.user.userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Add new message
    const newMessage = {
      sender: req.user.userId,
      content: req.body.content,
      attachments: req.body.attachments || []
    };

    chat.messages.push(newMessage);
    await chat.save();

    const populatedChat = await Chat.findById(chat._id)
      .populate('participants', 'name avatar')
      .populate('listing', 'title price images');

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    io.to(chat._id.toString()).emit('new_message', {
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
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      isActive: true
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Check if user is participant
    if (!chat.isParticipant(req.user.userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await chat.markAsRead(req.user.userId);
    // Notify other participant about read status
    const io = req.app.get('io');
    io.to(chat._id.toString()).emit('messages_read', {
      chatId: chat._id,
      userId: req.user.userId
    });

    res.json(chat);
  } catch (error) {
    console.error('Mark messages read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Close/Archive chat
router.put('/:chatId/close', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      isActive: true
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Check if user is participant
    if (!chat.isParticipant(req.user.userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    chat.status = 'closed';
    await chat.save();

    // Notify other participant about chat closure
    const io = req.app.get('io');
    io.to(chat._id.toString()).emit('chat_closed', {
      chatId: chat._id,
      userId: req.user.userId
    });

    res.json(chat);
  } catch (error) {
    console.error('Close chat error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Report chat/user
router.post('/:chatId/report', [
  auth,
  body('reason').trim().notEmpty().withMessage('Report reason is required'),
  body('description').trim().optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const chat = await Chat.findOne({
      _id: req.params.chatId,
      isActive: true
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Check if user is participant
    if (!chat.isParticipant(req.user.userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Here you would typically create a Report model and save the report
    // For now, we'll just mark the chat as reported
    chat.status = 'blocked';
    await chat.save();

    // Notify admins about the report (you would need to implement this)
    const io = req.app.get('io');
    io.to('admin').emit('chat_reported', {
      chatId: chat._id,
      userId: req.user.userId,
      reason: req.body.reason,
      description: req.body.description
    });

    res.json({ message: 'Chat reported successfully' });
  } catch (error) {
    console.error('Report chat error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete chat (soft delete)
router.delete('/:chatId', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      participants: req.user.userId
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Soft delete by marking as inactive
    chat.isActive = false;
    await chat.save();

    // Notify other participant about deletion
    const io = req.app.get('io');
    io.to(chat._id.toString()).emit('chat_deleted', {
      chatId: chat._id,
      userId: req.user.userId
    });

    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;