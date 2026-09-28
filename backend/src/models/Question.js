const mongoose = require('mongoose');

const questionOptionSchema = new mongoose.Schema({
  optionId: { type: String, required: true },
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
});

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Question title or problem statement is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Question category is required'],
      enum: ['Quantitative', 'Logical Reasoning', 'Verbal Ability', 'CS Core', 'Coding'],
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
      index: true,
    },
    type: {
      type: String,
      enum: ['mcq', 'coding'],
      default: 'mcq',
      index: true,
    },
    options: [questionOptionSchema],
    explanation: {
      type: String,
      default: '',
    },
    codingDetails: {
      starterCode: { type: String, default: '' },
      language: { type: String, default: 'javascript' },
      sampleInput: { type: String, default: '' },
      sampleOutput: { type: String, default: '' },
      testCases: [
        {
          input: { type: String, default: '' },
          expectedOutput: { type: String, default: '' },
          isHidden: { type: Boolean, default: false },
        },
      ],
    },
    tags: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
