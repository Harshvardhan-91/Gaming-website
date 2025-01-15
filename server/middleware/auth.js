const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Log the full authorization header
    console.log('Full Authorization header:', req.header('Authorization'));

    // Extract the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token from header:', token);

    // Return error if no token is provided
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // Log token format check
    console.log('Token parts:', token.split('.').length);
    console.log('Is token in correct format:', token.split('.').length === 3);

    // Verify JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
      // Use JWT_SECRET from environment variables for verification
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded payload:', decoded);

      // Add decoded user information to the request object
      req.user = decoded;

      // Pass control to the next middleware
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', {
        name: jwtError.name,
        message: jwtError.message,
        stack: jwtError.stack
      });
      return res.status(401).json({ error: 'Token verification failed', details: jwtError.message });
    }
  } catch (error) {
    console.error('Auth middleware error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(401).json({ error: 'Token is not valid', details: error.message });
  }
};