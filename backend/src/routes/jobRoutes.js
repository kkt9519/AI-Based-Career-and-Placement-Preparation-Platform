const express = require('express');
const {
  getJobs,
  getJobById,
  saveJob,
  unsaveJob,
  getSavedJobs,
  applyToJob,
  getApplications,
} = require('../controllers/jobController');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Specific routes first to prevent :id conflict
router.get('/saved', protect, getSavedJobs);
router.get('/applications', protect, getApplications);

// Public listings with optional auth personalization
router.get('/', optionalAuth, getJobs);
router.get('/:id', optionalAuth, getJobById);

// Protected candidate actions
router.post('/:id/save', protect, saveJob);
router.delete('/:id/save', protect, unsaveJob);
router.post('/:id/apply', protect, applyToJob);

module.exports = router;
