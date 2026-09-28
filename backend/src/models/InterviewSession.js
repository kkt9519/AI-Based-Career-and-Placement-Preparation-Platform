const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  questionText: { type: String, required: true },
  topic: { type: String, default: 'General' },
  idealAnswerPoints: { type: [String], default: [] },
});

const interviewAnswerSchema = new mongoose.Schema({
  questionIndex: { type: Number, required: true },
  questionText: { type: String, required: true },
  userAnswer: { type: String, required: true },
  feedback: { type: String, default: '' },
  score: { type: Number, min: 1, max: 10, default: 5 },
  criteriaScores: {
    relevance: { type: Number, min: 1, max: 10, default: 5 },
    technicalAccuracy: { type: Number, min: 1, max: 10, default: 5 },
    clarity: { type: Number, min: 1, max: 10, default: 5 },
    completeness: { type: Number, min: 1, max: 10, default: 5 },
    communication: { type: Number, min: 1, max: 10, default: 5 },
  },
  suggestedImprovement: { type: String, default: '' },
  topicsToRevise: { type: [String], default: [] },
  submittedAt: { type: Date, default: Date.now },
});

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    interviewType: {
      type: String,
      enum: ['Technical', 'HR'],
      default: 'Technical',
      index: true,
    },
    role: {
      type: String,
      required: true,
      default: 'MERN Stack Developer',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    totalQuestions: {
      type: Number,
      default: 3,
    },
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    questions: [interviewQuestionSchema],
    answers: [interviewAnswerSchema],
    finalScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    overallFeedback: {
      type: String,
      default: '',
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Method to calculate session final score
interviewSessionSchema.methods.calculateFinalScore = function () {
  if (!this.answers || this.answers.length === 0) return 0;
  const total = this.answers.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const avgOutOfTen = total / this.answers.length;
  this.finalScore = Math.round(avgOutOfTen * 10); // Scale to 100
  return this.finalScore;
};

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);

module.exports = InterviewSession;
