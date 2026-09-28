const express = require('express');
const {
  getRoadmap,
  createOrRegenerateRoadmap,
  toggleMilestone,
} = require('../controllers/careerController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All career roadmap routes require authentication

router.get('/roadmap', getRoadmap);
router.post('/roadmap', createOrRegenerateRoadmap);
router.patch('/roadmap/:id/milestone/:milestoneId', toggleMilestone);

module.exports = router;
