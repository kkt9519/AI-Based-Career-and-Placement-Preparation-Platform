const express = require('express');
const {
  getProfile,
  updateProfile,
  getDashboardStats,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All user profile routes require authentication

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/dashboard', getDashboardStats);

module.exports = router;
