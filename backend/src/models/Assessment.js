const mongoose = require('mongoose');

const assessmentAnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  selectedOptionId: { type: String, default: null },
  submittedCode: { type: String, default: null },
  isCorrect: { type: Boolean, default: false },
  timeTakenSeconds: { type: Number, default: 0 },
});

const assessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      default: 'Placement Aptitude Practice',
    },
    category: {
      type: String,
      enum: ['All-Rounder', 'Quantitative', 'Logical Reasoning', 'Verbal Ability', 'CS Core', 'Coding'],
      default: 'Quantitative',
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', 'Mixed'],
      default: 'Medium',
    },
    totalQuestions: {
      type: Number,
      required: true,
      default: 5,
    },
    allocatedTimeMinutes: {
      type: Number,
      default: 15,
    },
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    questionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    answers: [assessmentAnswerSchema],
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
