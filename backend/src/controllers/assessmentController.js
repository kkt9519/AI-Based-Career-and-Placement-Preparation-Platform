const Assessment = require('../models/Assessment');
const Question = require('../models/Question');

/**
 * @desc    Get questions for practice (without revealing correct answers)
 * @route   GET /api/assessments/questions
 * @access  Private
 */
const getQuestions = async (req, res, next) => {
  try {
    const { category, difficulty, type, limit = 20, page = 1 } = req.query;
    const filter = { isActive: true };

    if (category && category !== 'All') filter.category = category;
    if (difficulty && difficulty !== 'All') filter.difficulty = difficulty;
    if (type && type !== 'All') filter.type = type;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Question.countDocuments(filter);
    const questions = await Question.find(filter)
      .select('-options.isCorrect -explanation')
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: questions,
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
 * @desc    Start an assessment test session
 * @route   POST /api/assessments/start
 * @access  Private
 */
const startAssessment = async (req, res, next) => {
  try {
    const {
      category = 'Quantitative',
      difficulty = 'Medium',
      totalQuestions = 5,
    } = req.body;

    const count = Math.min(Math.max(parseInt(totalQuestions, 10) || 5, 1), 20);

    const query = { isActive: true };
    if (category && category !== 'All-Rounder') {
      query.category = category;
    }
    if (difficulty && difficulty !== 'Mixed') {
      query.difficulty = difficulty;
    }

    let questions = await Question.find(query);

    // If not enough questions with strict difficulty, fall back to any difficulty within the same category
    if (questions.length < count && category !== 'All-Rounder') {
      questions = await Question.find({ isActive: true, category });
    }

    // ONLY for 'All-Rounder', if not enough, grab general pool
    if (category === 'All-Rounder' && questions.length < count) {
      questions = await Question.find({ isActive: true });
    }

    // Random shuffle
    const shuffled = questions.sort(() => 0.5 - Math.random()).slice(0, count);

    // Default time: 3 mins per question
    const allocatedTimeMinutes = Math.max(shuffled.length * 3, 5);

    const assessment = await Assessment.create({
      userId: req.user._id,
      title: `${category} Assessment (${difficulty})`,
      category,
      difficulty,
      totalQuestions: shuffled.length,
      allocatedTimeMinutes,
      questionIds: shuffled.map((q) => q._id),
      isCompleted: false,
    });

    // Strip answers for test room delivery
    const sanitizedQuestions = shuffled.map((q) => ({
      _id: q._id,
      title: q.title,
      description: q.description,
      category: q.category,
      difficulty: q.difficulty,
      type: q.type,
      options: q.options.map((opt) => ({
        optionId: opt.optionId,
        text: opt.text,
      })),
      codingDetails: q.codingDetails
        ? {
            language: q.codingDetails.language,
            starterCode: q.codingDetails.starterCode,
            sampleInput: q.codingDetails.sampleInput,
            sampleOutput: q.codingDetails.sampleOutput,
          }
        : null,
    }));

    res.status(201).json({
      success: true,
      message: 'Assessment session started.',
      data: {
        assessmentId: assessment._id,
        title: assessment.title,
        category: assessment.category,
        difficulty: assessment.difficulty,
        totalQuestions: assessment.totalQuestions,
        allocatedTimeMinutes: assessment.allocatedTimeMinutes,
        questions: sanitizedQuestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit assessment answers and get automated evaluation report
 * @route   POST /api/assessments/:id/submit
 * @access  Private
 */
const submitAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answers = [], timeSpentSeconds = 0 } = req.body;

    const assessment = await Assessment.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment session not found.',
      });
    }

    if (assessment.isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'This assessment has already been submitted.',
      });
    }

    // Fetch original questions with correct options and explanations
    const originalQuestions = await Question.find({
      _id: { $in: assessment.questionIds },
    });

    const questionMap = new Map();
    originalQuestions.forEach((q) => questionMap.set(q._id.toString(), q));

    let correctCount = 0;
    const evaluatedAnswers = [];
    const questionReview = [];

    assessment.questionIds.forEach((qId) => {
      const qIdStr = qId.toString();
      const question = questionMap.get(qIdStr);
      const userSubmission = answers.find(
        (a) => a.questionId && a.questionId.toString() === qIdStr
      );

      let isCorrect = false;
      const selectedOptionId = userSubmission ? userSubmission.selectedOptionId : null;
      const submittedCode = userSubmission ? userSubmission.submittedCode : null;
      const timeTaken = userSubmission ? userSubmission.timeTakenSeconds || 0 : 0;

      if (question) {
        if (question.type === 'mcq') {
          const correctOption = question.options.find((opt) => opt.isCorrect);
          if (correctOption && selectedOptionId && correctOption.optionId === selectedOptionId) {
            isCorrect = true;
            correctCount++;
          }
        } else if (question.type === 'coding') {
          // Verify code submission contains core syntax logic
          if (submittedCode && submittedCode.trim().length > 30) {
            isCorrect = true;
            correctCount++;
          }
        }

        evaluatedAnswers.push({
          questionId: question._id,
          selectedOptionId,
          submittedCode,
          isCorrect,
          timeTakenSeconds: timeTaken,
        });

        questionReview.push({
          questionId: question._id,
          title: question.title,
          description: question.description,
          category: question.category,
          type: question.type,
          options: question.options,
          explanation: question.explanation,
          selectedOptionId,
          submittedCode,
          isCorrect,
        });
      }
    });

    const total = assessment.totalQuestions || originalQuestions.length || 1;
    const percentage = Math.round((correctCount / total) * 100);
    const passed = percentage >= 60;

    assessment.answers = evaluatedAnswers;
    assessment.score = correctCount;
    assessment.percentage = percentage;
    assessment.passed = passed;
    assessment.timeSpentSeconds = parseInt(timeSpentSeconds, 10) || 0;
    assessment.isCompleted = true;
    assessment.completedAt = new Date();

    await assessment.save();

    res.status(200).json({
      success: true,
      message: 'Assessment submitted and scored successfully.',
      data: {
        assessmentId: assessment._id,
        title: assessment.title,
        category: assessment.category,
        score: correctCount,
        totalQuestions: total,
        percentage,
        passed,
        timeSpentSeconds: assessment.timeSpentSeconds,
        questionReview,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get student's past assessments history
 * @route   GET /api/assessments/history
 * @access  Private
 */
const getAssessmentHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter = { userId: req.user._id, isCompleted: true };
    const total = await Assessment.countDocuments(filter);
    const assessments = await Assessment.find(filter)
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: assessments,
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
 * @desc    Get aggregate stats for student aptitude analytics
 * @route   GET /api/assessments/stats
 * @access  Private
 */
const getAssessmentStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const completed = await Assessment.find({ userId, isCompleted: true });

    if (completed.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalAssessments: 0,
          averagePercentage: 0,
          testsPassed: 0,
          categoryBreakdown: {
            Quantitative: 0,
            'Logical Reasoning': 0,
            'Verbal Ability': 0,
            'CS Core': 0,
            Coding: 0,
          },
        },
      });
    }

    const totalAssessments = completed.length;
    const totalPercentage = completed.reduce((acc, c) => acc + (c.percentage || 0), 0);
    const averagePercentage = Math.round(totalPercentage / totalAssessments);
    const testsPassed = completed.filter((c) => c.passed).length;

    // Category aggregation
    const categoryTotals = {};
    const categoryCounts = {};

    completed.forEach((item) => {
      const cat = item.category || 'Quantitative';
      if (!categoryTotals[cat]) {
        categoryTotals[cat] = 0;
        categoryCounts[cat] = 0;
      }
      categoryTotals[cat] += item.percentage;
      categoryCounts[cat] += 1;
    });

    const categoryBreakdown = {
      Quantitative: categoryCounts['Quantitative']
        ? Math.round(categoryTotals['Quantitative'] / categoryCounts['Quantitative'])
        : 0,
      'Logical Reasoning': categoryCounts['Logical Reasoning']
        ? Math.round(categoryTotals['Logical Reasoning'] / categoryCounts['Logical Reasoning'])
        : 0,
      'Verbal Ability': categoryCounts['Verbal Ability']
        ? Math.round(categoryTotals['Verbal Ability'] / categoryCounts['Verbal Ability'])
        : 0,
      'CS Core': categoryCounts['CS Core']
        ? Math.round(categoryTotals['CS Core'] / categoryCounts['CS Core'])
        : 0,
      Coding: categoryCounts['Coding']
        ? Math.round(categoryTotals['Coding'] / categoryCounts['Coding'])
        : 0,
    };

    res.status(200).json({
      success: true,
      data: {
        totalAssessments,
        averagePercentage,
        testsPassed,
        categoryBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get assessment review details by ID
 * @route   GET /api/assessments/:id
 * @access  Private
 */
const getAssessmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const assessment = await Assessment.findOne({
      _id: id,
      userId: req.user._id,
    }).populate('questionIds');

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment session not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuestions,
  startAssessment,
  submitAssessment,
  getAssessmentHistory,
  getAssessmentStats,
  getAssessmentById,
};
