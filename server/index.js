const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const socket = require('socket.io');
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const listingRoutes = require('./routes/listing.routes');
const profileRoutes = require('./routes/profile.routes');
const adminRoutes = require('./routes/admin.routes');

dotenv.config();

const app = express();



app.use('/api/admin', adminRoutes);

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Handle preflight requests
app.options('*', cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB with enhanced options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true, // Build indexes
  maxPoolSize: 10 // Maintain up to 10 socket connections
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit if unable to connect to database
});

// Monitor MongoDB connection
mongoose.connection.on('disconnected', () => {
  console.log('Lost MongoDB connection');
});
mongoose.connection.on('reconnected', () => {
  console.log('Reconnected to MongoDB');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/profile', profileRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
});

// Socket.io setup
const io = setupSocket(server);
app.set('io', io); 

// Socket middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  // You could verify the token here if needed
  next();
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join personal room
  socket.join(`user_${socket.handshake.auth.userId}`);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room ${roomId}`);
  });

  socket.on('send_message', (data) => {
    io.to(data.roomId).emit('receive_message', data);
  });

  socket.on('typing', (data) => {
    socket.to(data.roomId).emit('user_typing', {
      userId: socket.handshake.auth.userId,
      typing: true
    });
  });

  socket.on('stop_typing', (data) => {
    socket.to(data.roomId).emit('user_typing', {
      userId: socket.handshake.auth.userId,
      typing: false
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle specific errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: Object.values(err.errors).map(error => error.message)
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Something went wrong!'
  });
});

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

module.exports = { app, server, io };