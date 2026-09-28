const User = require('../models/User');
const Resume = require('../models/Resume');
const { updateProfileSchema } = require('../validators/userValidator');

// @desc    Get logged in user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        targetRole: user.targetRole,
        careerGoals: user.careerGoals,
        skills: user.skills,
        profile: user.profile,
        profileCompletion: user.calculateProfileCompletion(),
        accountStatus: user.accountStatus,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (validatedData.name) user.name = validatedData.name;
    if (validatedData.targetRole) user.targetRole = validatedData.targetRole;
    if (validatedData.careerGoals !== undefined) user.careerGoals = validatedData.careerGoals;
    if (validatedData.skills) user.skills = validatedData.skills;

    if (validatedData.profile) {
      user.profile = {
        ...user.profile.toObject(),
        ...validatedData.profile,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        targetRole: user.targetRole,
        careerGoals: user.careerGoals,
        skills: user.skills,
        profile: user.profile,
        profileCompletion: user.calculateProfileCompletion(),
        accountStatus: user.accountStatus,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get real aggregated student dashboard statistics
// @route   GET /api/users/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 1. Fetch resumes
    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
    const latestResume = resumes.length > 0 ? resumes[0] : null;

    // 2. Fetch resume analyses if model exists
    let latestAnalysis = null;
    try {
      const ResumeAnalysis = require('../models/ResumeAnalysis');
      latestAnalysis = await ResumeAnalysis.findOne({ userId }).sort({ createdAt: -1 });
    } catch (e) {
      // ResumeAnalysis might not be seeded or created yet
    }

    // 3. Fetch interview stats if model exists
    let totalInterviews = 0;
    let avgInterviewScore = 0;
    try {
      const InterviewSession = require('../models/InterviewSession');
      const interviews = await InterviewSession.find({ userId });
      totalInterviews = interviews.length;
      if (totalInterviews > 0) {
        const total = interviews.reduce((acc, curr) => acc + (curr.finalScore || 0), 0);
        avgInterviewScore = Math.round(total / totalInterviews);
      }
    } catch (e) {
      // Model not yet imported
    }

    // 4. Fetch assessments stats if model exists
    let totalAssessments = 0;
    let avgAssessmentScore = 0;
    try {
      const Assessment = require('../models/Assessment');
      const assessments = await Assessment.find({ userId });
      totalAssessments = assessments.length;
      if (totalAssessments > 0) {
        const total = assessments.reduce((acc, curr) => acc + (curr.score || 0), 0);
        avgAssessmentScore = Math.round(total / totalAssessments);
      }
    } catch (e) {
      // Model not yet imported
    }

    // 5. Aggregate recent activities
    const recentActivities = [];

    if (user.updatedAt) {
      recentActivities.push({
        id: 'act-profile',
        title: 'Profile Updated',
        description: `Targeting role: ${user.targetRole}`,
        timestamp: user.updatedAt,
        type: 'profile',
      });
    }

    if (latestResume) {
      recentActivities.push({
        id: 'act-resume-' + latestResume._id,
        title: 'Resume Uploaded',
        description: `Uploaded ${latestResume.originalName}`,
        timestamp: latestResume.createdAt,
        type: 'resume',
      });
    }

    if (latestAnalysis) {
      recentActivities.push({
        id: 'act-analysis-' + latestAnalysis._id,
        title: 'Resume AI Analysis Completed',
        description: `Score: ${latestAnalysis.overallScore}/100 for ${latestAnalysis.targetRole}`,
        timestamp: latestAnalysis.createdAt,
        type: 'analysis',
      });
    }

    // Sort recent activities by timestamp descending
    recentActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.status(200).json({
      success: true,
      stats: {
        profileCompletion: user.calculateProfileCompletion(),
        targetRole: user.targetRole,
        totalSkills: user.skills ? user.skills.length : 0,
        skills: user.skills || [],
        totalResumes: resumes.length,
        latestResume: latestResume
          ? {
              id: latestResume._id,
              name: latestResume.originalName,
              uploadedAt: latestResume.createdAt,
              fileSize: latestResume.fileSize,
            }
          : null,
        resumeScore: latestAnalysis ? latestAnalysis.overallScore : null,
        totalAssessments,
        avgAssessmentScore,
        totalInterviews,
        avgInterviewScore,
        recentActivities,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getDashboardStats,
};
