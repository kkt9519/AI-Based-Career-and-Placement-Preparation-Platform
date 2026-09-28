const express = require('express');
const router = express.Router();
const {
  getQuestions,
  startAssessment,
  submitAssessment,
  getAssessmentHistory,
  getAssessmentStats,
  getAssessmentById,
} = require('../controllers/assessmentController');
const { protect } = require('../middleware/auth');

// All assessment endpoints require authentication
router.use(protect);

router.get('/questions', getQuestions);
router.post('/start', startAssessment);
router.post('/:id/submit', submitAssessment);
router.get('/history', getAssessmentHistory);
router.get('/stats', getAssessmentStats);
router.get('/:id', getAssessmentById);

module.exports = router;
