const User = require('../models/User');
const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const InterviewSession = require('../models/InterviewSession');
const Assessment = require('../models/Assessment');
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const Question = require('../models/Question');

/**
 * @desc    Get aggregated platform statistics for Admin Dashboard
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin only)
 */
const getAdminDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalResumes,
      totalAnalyses,
      totalInterviews,
      totalAssessments,
      totalJobs,
      totalApplications,
      interviewScores,
      recentSignups,
      recentApplications,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      Resume.countDocuments(),
      ResumeAnalysis.countDocuments(),
      InterviewSession.countDocuments({ isCompleted: true }),
      Assessment.countDocuments({ isCompleted: true }),
      Job.countDocuments({ isActive: true }),
      JobApplication.countDocuments(),
      InterviewSession.aggregate([
        { $match: { isCompleted: true, finalScore: { $gt: 0 } } },
        { $group: { _id: null, avgScore: { $avg: '$finalScore' } } },
      ]),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email role profile.college profile.cgpa profileCompletion createdAt isActive'),
      JobApplication.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'name email profile.college')
        .populate('jobId', 'title company location'),
    ]);

    const averageInterviewScore =
      interviewScores.length > 0 ? Math.round(interviewScores[0].avgScore) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalResumes,
        totalAnalyses,
        totalInterviews,
        totalAssessments,
        totalJobs,
        totalApplications,
        averageInterviewScore,
        recentSignups,
        recentApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    List all users with filters and pagination
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
const getUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 15 } = req.query;
    const filter = {};

    if (role && role !== 'All') filter.role = role;
    if (search && search.trim() !== '') {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { 'profile.college': { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-password -resetPasswordToken -resetPasswordExpire');

    res.status(200).json({
      success: true,
      data: users,
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
 * @desc    Update user active status (activate/suspend)
 * @route   PATCH /api/admin/users/:id/status
 * @access  Private (Admin only)
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive boolean flag is required.',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Protect against self-deactivation
    if (user._id.toString() === req.user._id.toString() && !isActive) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own admin account.',
      });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${isActive ? 'activated' : 'suspended'}.`,
      data: {
        userId: user._id,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new placement job / internship
 * @route   POST /api/admin/jobs
 * @access  Private (Admin only)
 */
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      description,
      requiredSkills,
      preferredSkills,
      location,
      workMode,
      jobType,
      experience,
      salary,
      applicationDeadline,
      applicationUrl,
    } = req.body;

    if (!title || !company || !description || !requiredSkills) {
      return res.status(400).json({
        success: false,
        message: 'Title, company, description, and required skills are required.',
      });
    }

    const job = await Job.create({
      title,
      company,
      description,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [requiredSkills],
      preferredSkills: Array.isArray(preferredSkills) ? preferredSkills : [],
      location: location || 'Remote, India',
      workMode: workMode || 'Remote',
      jobType: jobType || 'Full-time',
      experience: experience || 'Fresher',
      salary: salary || 'Competitive',
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      applicationUrl: applicationUrl || '',
      createdBy: req.user._id,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully.',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update existing job posting
 * @route   PUT /api/admin/jobs/:id
 * @access  Private (Admin only)
 */
const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job posting updated successfully.',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete job posting
 * @route   DELETE /api/admin/jobs/:id
 * @access  Private (Admin only)
 */
const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found.',
      });
    }

    // Clean up applications
    await JobApplication.deleteMany({ jobId: id });

    res.status(200).json({
      success: true,
      message: 'Job and associated applications deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create question in Question Bank
 * @route   POST /api/admin/questions
 * @access  Private (Admin only)
 */
const createQuestion = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      type = 'mcq',
      options,
      explanation,
      codingDetails,
      tags,
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title and category are required.',
      });
    }

    const question = await Question.create({
      title,
      description,
      category,
      difficulty: difficulty || 'Medium',
      type,
      options: options || [],
      explanation: explanation || '',
      codingDetails: codingDetails || {},
      tags: tags || [],
      createdBy: req.user._id,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Question added to Question Bank successfully.',
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update question
 * @route   PUT /api/admin/questions/:id
 * @access  Private (Admin only)
 */
const updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const question = await Question.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question updated successfully.',
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete question
 * @route   DELETE /api/admin/questions/:id
 * @access  Private (Admin only)
 */
const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboardStats,
  getUsers,
  updateUserStatus,
  createJob,
  updateJob,
  deleteJob,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
