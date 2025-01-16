const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

const onlineUsers = new Map(); // Store online users
const typingUsers = new Map(); // Store typing status

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);
    
    // Add user to online users
    onlineUsers.set(socket.userId, socket.id);
    io.emit('user_status_changed', {
      userId: socket.userId,
      online: true
    });

    // Join user's personal room
    socket.join(socket.userId);

    // Handle joining chat rooms
    socket.on('join_chat', (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.userId} joined chat ${chatId}`);
    });

    // Handle leaving chat rooms
    socket.on('leave_chat', (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.userId} left chat ${chatId}`);
    });

    // Handle typing status
    socket.on('typing_started', ({ chatId }) => {
      const typingKey = `${chatId}:${socket.userId}`;
      typingUsers.set(typingKey, Date.now());
      socket.to(chatId).emit('user_typing', {
        userId: socket.userId,
        chatId,
        typing: true
      });
    });

    socket.on('typing_stopped', ({ chatId }) => {
      const typingKey = `${chatId}:${socket.userId}`;
      typingUsers.delete(typingKey);
      socket.to(chatId).emit('user_typing', {
        userId: socket.userId,
        chatId,
        typing: false
      });
    });

    // Handle message reactions
    socket.on('add_reaction', ({ chatId, messageId, reaction }) => {
      io.to(chatId).emit('message_reaction', {
        chatId,
        messageId,
        userId: socket.userId,
        reaction
      });
    });

    // Handle message delivery status
    socket.on('message_delivered', ({ chatId, messageId }) => {
      io.to(chatId).emit('delivery_status', {
        chatId,
        messageId,
        status: 'delivered'
      });
    });

    // Handle message read status
    socket.on('message_read', ({ chatId, messageId }) => {
      io.to(chatId).emit('read_status', {
        chatId,
        messageId,
        userId: socket.userId
      });
    });

    // Clean up typing status periodically
    const cleanupTyping = setInterval(() => {
      const now = Date.now();
      for (const [key, timestamp] of typingUsers.entries()) {
        if (now - timestamp > 5000) { // Remove after 5 seconds of inactivity
          const [chatId, userId] = key.split(':');
          typingUsers.delete(key);
          io.to(chatId).emit('user_typing', {
            userId,
            chatId,
            typing: false
          });
        }
      }
    }, 5000);

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
      onlineUsers.delete(socket.userId);
      clearInterval(cleanupTyping);
      
      // Clear typing status
      for (const [key, value] of typingUsers.entries()) {
        if (key.includes(socket.userId)) {
          const [chatId] = key.split(':');
          typingUsers.delete(key);
          io.to(chatId).emit('user_typing', {
            userId: socket.userId,
            chatId,
            typing: false
          });
        }
      }

      io.emit('user_status_changed', {
        userId: socket.userId,
        online: false
      });
    });
  });

  return io;
};

module.exports = setupSocket;