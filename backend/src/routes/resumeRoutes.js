const express = require('express');
const {
  uploadResume,
  analyzeResumeById,
  getResumes,
  getResumeById,
  getAnalysisHistory,
  deleteResume,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect); // All resume routes require authentication

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/analyses/history', getAnalysisHistory);
router.post('/:id/analyze', analyzeResumeById);
router.get('/', getResumes);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

module.exports = router;
