const InterviewSession = require('../models/InterviewSession');
const {
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  generateInterviewSummary,
} = require('../services/aiService');

/**
 * @desc    Start a new AI Mock Interview session
 * @route   POST /api/interviews/start
 * @access  Private (Student, Admin)
 */
const startInterview = async (req, res, next) => {
  try {
    const {
      interviewType = 'Technical',
      role = 'MERN Stack Developer',
      difficulty = 'Intermediate',
      totalQuestions = 3,
    } = req.body;

    const questionsCount = Math.min(Math.max(parseInt(totalQuestions, 10) || 3, 1), 10);

    const generatedQuestions = generateInterviewQuestions(
      interviewType,
      role,
      difficulty,
      questionsCount
    );

    const session = await InterviewSession.create({
      userId: req.user._id,
      interviewType,
      role,
      difficulty,
      totalQuestions: generatedQuestions.length,
      currentQuestionIndex: 0,
      questions: generatedQuestions,
      answers: [],
      isCompleted: false,
    });

    const firstQuestion = session.questions[0]
      ? {
          index: 0,
          questionId: session.questions[0].questionId,
          questionText: session.questions[0].questionText,
          topic: session.questions[0].topic,
        }
      : null;

    res.status(201).json({
      success: true,
      message: 'Mock interview session initiated successfully.',
      data: {
        sessionId: session._id,
        interviewType: session.interviewType,
        role: session.role,
        difficulty: session.difficulty,
        totalQuestions: session.totalQuestions,
        currentQuestionIndex: 0,
        currentQuestion: firstQuestion,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit candidate answer for current interview question and get AI evaluation
 * @route   POST /api/interviews/:id/answer
 * @access  Private (Student, Admin)
 */
const submitAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { questionIndex, userAnswer } = req.body;

    if (!userAnswer || userAnswer.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Answer text is required.',
      });
    }

    const session = await InterviewSession.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found.',
      });
    }

    if (session.isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'This interview session has already been completed.',
      });
    }

    const qIdx = parseInt(questionIndex, 10);
    if (isNaN(qIdx) || qIdx < 0 || qIdx >= session.questions.length) {
      return res.status(400).json({
        success: false,
        message: `Invalid question index: ${questionIndex}. Must be between 0 and ${session.questions.length - 1}.`,
      });
    }

    const question = session.questions[qIdx];

    // Evaluate answer via AI service
    const evaluation = await evaluateInterviewAnswer(
      question.questionText,
      userAnswer,
      session.interviewType,
      session.role,
      question.topic
    );

    const answerRecord = {
      questionIndex: qIdx,
      questionText: question.questionText,
      userAnswer: userAnswer.trim(),
      feedback: evaluation.feedback,
      score: evaluation.score,
      criteriaScores: evaluation.criteriaScores,
      suggestedImprovement: evaluation.suggestedImprovement,
      topicsToRevise: evaluation.topicsToRevise,
      submittedAt: new Date(),
    };

    // Update existing answer or push new
    const existingAnsIdx = session.answers.findIndex((a) => a.questionIndex === qIdx);
    if (existingAnsIdx >= 0) {
      session.answers[existingAnsIdx] = answerRecord;
    } else {
      session.answers.push(answerRecord);
    }

    session.currentQuestionIndex = qIdx + 1;

    // Check if all questions have been answered
    let nextQuestion = null;
    if (session.currentQuestionIndex >= session.questions.length) {
      session.isCompleted = true;
      session.completedAt = new Date();
      const summary = generateInterviewSummary(session);
      session.finalScore = summary.finalScore;
      session.overallFeedback = summary.overallFeedback;
    } else {
      const nextQ = session.questions[session.currentQuestionIndex];
      nextQuestion = {
        index: session.currentQuestionIndex,
        questionId: nextQ.questionId,
        questionText: nextQ.questionText,
        topic: nextQ.topic,
      };
    }

    await session.save();

    res.status(200).json({
      success: true,
      message: 'Answer evaluated successfully.',
      data: {
        sessionId: session._id,
        currentQuestionIndex: session.currentQuestionIndex,
        isCompleted: session.isCompleted,
        evaluation: answerRecord,
        nextQuestion,
        finalScore: session.isCompleted ? session.finalScore : undefined,
        overallFeedback: session.isCompleted ? session.overallFeedback : undefined,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Finish an ongoing interview session
 * @route   POST /api/interviews/:id/finish
 * @access  Private (Student, Admin)
 */
const finishInterview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const session = await InterviewSession.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found.',
      });
    }

    if (!session.isCompleted) {
      session.isCompleted = true;
      session.completedAt = new Date();
      const summary = generateInterviewSummary(session);
      session.finalScore = summary.finalScore;
      session.overallFeedback = summary.overallFeedback;
      await session.save();
    }

    res.status(200).json({
      success: true,
      message: 'Interview session completed.',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get student's interview history
 * @route   GET /api/interviews/history
 * @access  Private (Student, Admin)
 */
const getInterviewHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter = { userId: req.user._id };

    const total = await InterviewSession.countDocuments(filter);
    const sessions = await InterviewSession.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-questions.idealAnswerPoints');

    res.status(200).json({
      success: true,
      data: sessions,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed interview session by ID
 * @route   GET /api/interviews/:id
 * @access  Private (Student, Admin)
 */
const getInterviewById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = { _id: id };
    // Non-admin can only access their own sessions
    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    }

    const session = await InterviewSession.findOne(query);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  finishInterview,
  getInterviewHistory,
  getInterviewById,
};
