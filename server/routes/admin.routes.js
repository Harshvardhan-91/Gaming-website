const router = require('express').Router();
const User = require('../models/User');
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');
const adminController = require('../controllers/admin.controller');
const isAdmin = require('../middleware/isAdmin');

// Dashboard Stats
router.get('/dashboard/stats', [auth, isAdmin], adminController.getDashboardStats);

// User Management
router.get('/users', [auth, isAdmin], adminController.getAllUsers);
router.patch('/users/:id', [auth, isAdmin], adminController.updateUser);
router.delete('/users/:id', [auth, isAdmin], adminController.deleteUser);

// Report Management
router.get('/reports', [auth, isAdmin], adminController.getAllReports);
router.patch('/reports/:id', [auth, isAdmin], adminController.updateReport);

// Listing Management
router.get('/listings', [auth, isAdmin], adminController.getAllListings);
router.delete('/listings/:id', [auth, isAdmin], adminController.deleteListing);

module.exports = router;