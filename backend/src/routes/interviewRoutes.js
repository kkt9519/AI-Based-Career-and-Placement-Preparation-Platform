const express = require('express');
const router = express.Router();
const {
  startInterview,
  submitAnswer,
  finishInterview,
  getInterviewHistory,
  getInterviewById,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

// All interview routes require authentication
router.use(protect);

router.post('/start', startInterview);
router.get('/history', getInterviewHistory);
router.get('/:id', getInterviewById);
router.post('/:id/answer', submitAnswer);
router.post('/:id/finish', finishInterview);

module.exports = router;
