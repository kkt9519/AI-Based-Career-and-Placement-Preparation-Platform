const fs = require('fs');
const path = require('path');
const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const User = require('../models/User');
const { extractResumeText } = require('../utils/resumeParser');
const { analyzeResume } = require('../services/aiService');

// @desc    Upload and extract text from resume (PDF/DOCX)
// @route   POST /api/resumes/upload
// @access  Private
const uploadResume = async (req, res, next) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({
        success: false,
        message: req.fileValidationError,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded. Please upload a PDF or DOCX file.',
      });
    }

    const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '');
    const fileType = ext === 'pdf' ? 'pdf' : 'docx';

    let extractedText = '';
    try {
      extractedText = await extractResumeText(req.file.path, fileType);
    } catch (parseError) {
      // Remove file if corrupted
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(422).json({
        success: false,
        message: `Unable to extract text from file: ${parseError.message}`,
      });
    }

    const resume = await Resume.create({
      userId: req.user._id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileType,
      fileSize: req.file.size,
      storagePath: req.file.path,
      extractedText,
      uploadedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and text extracted successfully.',
      resume: {
        _id: resume._id,
        originalName: resume.originalName,
        fileType: resume.fileType,
        fileSize: resume.fileSize,
        extractedTextPreview: extractedText.slice(0, 300) + (extractedText.length > 300 ? '...' : ''),
        textLength: extractedText.length,
        uploadedAt: resume.uploadedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Analyze uploaded resume using Gemini AI / heuristic analyzer
// @route   POST /api/resumes/:id/analyze
// @access  Private
const analyzeResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    if (resume.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: You cannot analyze another user\'s resume' });
    }

    const user = await User.findById(req.user._id);
    const targetRole = req.body.targetRole || user.targetRole || 'MERN Stack Developer';

    const aiResult = await analyzeResume(resume.extractedText, targetRole, user.skills || []);

    const analysis = await ResumeAnalysis.create({
      userId: req.user._id,
      resumeId: resume._id,
      targetRole,
      overallScore: aiResult.overallScore,
      categoryScores: aiResult.categoryScores,
      skillsIdentified: aiResult.skillsIdentified,
      missingSkills: aiResult.missingSkills,
      strengths: aiResult.strengths,
      weaknesses: aiResult.weaknesses,
      recommendations: aiResult.recommendations,
      projectSuggestions: aiResult.projectSuggestions,
      roleFitSummary: aiResult.roleFitSummary,
      disclaimer: aiResult.disclaimer || 'This AI-generated score is an educational preparation metric calibrated to identify learning gaps and should not be used as an objective employer hiring decision.',
    });

    res.status(201).json({
      success: true,
      message: 'Resume analyzed successfully.',
      analysis,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all uploaded resumes for logged-in student
// @route   GET /api/resumes
// @access  Private
const getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .select('-extractedText')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
// @access  Private
const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    if (resume.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to access this resume.',
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all past analysis reports for student
// @route   GET /api/resumes/analyses/history
// @access  Private
const getAnalysisHistory = async (req, res, next) => {
  try {
    const analyses = await ResumeAnalysis.find({ userId: req.user._id })
      .populate('resumeId', 'originalName fileType fileSize')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: analyses.length,
      analyses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume file and record
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    if (resume.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot delete another user\'s resume.',
      });
    }

    // Delete physical file from disk if present
    if (fs.existsSync(resume.storagePath)) {
      try {
        fs.unlinkSync(resume.storagePath);
      } catch (err) {
        console.warn(`Could not delete file ${resume.storagePath}: ${err.message}`);
      }
    }

    await Resume.findByIdAndDelete(req.params.id);
    await ResumeAnalysis.deleteMany({ resumeId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Resume and associated analyses deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResume,
  analyzeResumeById,
  getResumes,
  getResumeById,
  getAnalysisHistory,
  deleteResume,
};
