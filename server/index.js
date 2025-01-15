const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const socket = require('socket.io');
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const listingRoutes = require('./routes/listing.routes');

dotenv.config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow credentials (cookies, authorization headers)
}));

// Handle preflight requests (OPTIONS)
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
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/listings', listingRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Socket.io setup
const io = socket(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('send_message', (data) => {
    io.to(data.roomId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something broke!'
  });
});
