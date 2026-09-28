const CareerRoadmap = require('../models/CareerRoadmap');
const User = require('../models/User');
const { generateCareerRoadmap } = require('../services/aiService');

// @desc    Get or auto-generate personalized career roadmap for logged-in student
// @route   GET /api/career/roadmap
// @access  Private
const getRoadmap = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let roadmap = await CareerRoadmap.findOne({ userId }).sort({ updatedAt: -1 });

    if (!roadmap) {
      const user = await User.findById(userId);
      const targetRole = user.targetRole || 'MERN Stack Developer';
      const currentSkills = user.skills || [];
      const careerGoals = user.careerGoals || '';

      const generatedData = await generateCareerRoadmap(targetRole, currentSkills, careerGoals);

      roadmap = await CareerRoadmap.create({
        userId,
        targetRole: generatedData.targetRole,
        currentSkills: generatedData.currentSkills,
        missingSkills: generatedData.missingSkills,
        milestones: generatedData.milestones,
        recommendedProjects: generatedData.recommendedProjects,
        overallProgress: generatedData.overallProgress,
      });
    }

    res.status(200).json({
      success: true,
      roadmap,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate / regenerate roadmap for specified target role
// @route   POST /api/career/roadmap
// @access  Private
const createOrRegenerateRoadmap = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const targetRole = req.body.targetRole || user.targetRole || 'MERN Stack Developer';
    const currentSkills = req.body.currentSkills || user.skills || [];
    const careerGoals = req.body.careerGoals || user.careerGoals || '';

    // Update user targetRole if supplied
    if (req.body.targetRole && req.body.targetRole !== user.targetRole) {
      user.targetRole = req.body.targetRole;
      await user.save();
    }

    const generatedData = await generateCareerRoadmap(targetRole, currentSkills, careerGoals);

    // Update existing roadmap or create a new one
    let roadmap = await CareerRoadmap.findOne({ userId, targetRole });

    if (roadmap) {
      roadmap.currentSkills = generatedData.currentSkills;
      roadmap.missingSkills = generatedData.missingSkills;
      roadmap.milestones = generatedData.milestones;
      roadmap.recommendedProjects = generatedData.recommendedProjects;
      roadmap.calculateProgress();
      await roadmap.save();
    } else {
      roadmap = await CareerRoadmap.create({
        userId,
        targetRole: generatedData.targetRole,
        currentSkills: generatedData.currentSkills,
        missingSkills: generatedData.missingSkills,
        milestones: generatedData.milestones,
        recommendedProjects: generatedData.recommendedProjects,
        overallProgress: generatedData.overallProgress,
      });
    }

    res.status(200).json({
      success: true,
      message: `Personalized roadmap generated for ${targetRole}`,
      roadmap,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle milestone progress status
// @route   PATCH /api/career/roadmap/:id/milestone/:milestoneId
// @access  Private
const toggleMilestone = async (req, res, next) => {
  try {
    const { id, milestoneId } = req.params;
    const roadmap = await CareerRoadmap.findById(id);

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    if (roadmap.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: You cannot modify this roadmap' });
    }

    const milestone = roadmap.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found in roadmap' });
    }

    // Toggle completion status
    milestone.completed = !milestone.completed;
    roadmap.calculateProgress();
    await roadmap.save();

    res.status(200).json({
      success: true,
      message: `Milestone marked as ${milestone.completed ? 'completed' : 'pending'}`,
      overallProgress: roadmap.overallProgress,
      roadmap,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoadmap,
  createOrRegenerateRoadmap,
  toggleMilestone,
};
