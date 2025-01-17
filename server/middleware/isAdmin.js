// server/middleware/isAdmin.js
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user?.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized as admin' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = isAdmin;