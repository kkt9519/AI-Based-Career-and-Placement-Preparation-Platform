const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getUsers,
  updateUserStatus,
  createJob,
  updateJob,
  deleteJob,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/adminController');
const { protect, requireRole } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(protect);
router.use(requireRole('admin'));

// Platform statistics & users
router.get('/dashboard', getAdminDashboardStats);
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);

// Job Management
router.post('/jobs', createJob);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);

// Question Bank Management
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

module.exports = router;
