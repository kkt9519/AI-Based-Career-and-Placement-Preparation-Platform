const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
      index: true,
    },
    targetRole: {
      type: String,
      required: true,
      default: 'MERN Stack Developer',
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    categoryScores: {
      impact: { type: Number, default: 0, min: 0, max: 100 },
      completeness: { type: Number, default: 0, min: 0, max: 100 },
      skills: { type: Number, default: 0, min: 0, max: 100 },
      formatting: { type: Number, default: 0, min: 0, max: 100 },
    },
    skillsIdentified: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    recommendations: {
      type: [String],
      default: [],
    },
    projectSuggestions: {
      type: [String],
      default: [],
    },
    roleFitSummary: {
      type: String,
      default: '',
    },
    disclaimer: {
      type: String,
      default: 'This AI-generated score is an educational preparation metric calibrated to identify learning gaps and should not be used as an objective employer hiring decision.',
    },
  },
  {
    timestamps: true,
  }
);

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);

module.exports = ResumeAnalysis;
