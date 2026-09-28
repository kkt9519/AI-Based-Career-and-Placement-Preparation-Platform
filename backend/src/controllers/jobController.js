const Job = require('../models/Job');
const SavedJob = require('../models/SavedJob');
const JobApplication = require('../models/JobApplication');
const User = require('../models/User');

// @desc    Get all active jobs with search, filtering, and skill match calculation
// @route   GET /api/jobs
// @access  Public / Private
const getJobs = async (req, res, next) => {
  try {
    const { search, location, workMode, jobType, page = 1, limit = 20 } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { requiredSkills: { $regex: search, $options: 'i' } },
      ];
    }

    if (location && location !== 'All') {
      query.location = { $regex: location, $options: 'i' };
    }

    if (workMode && workMode !== 'All') {
      query.workMode = workMode;
    }

    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    // Get user skills if authenticated
    let candidateSkills = [];
    let savedJobIds = [];
    let appliedJobIds = [];

    if (req.user) {
      candidateSkills = req.user.skills || [];
      const [saved, applied] = await Promise.all([
        SavedJob.find({ userId: req.user._id }).select('jobId'),
        JobApplication.find({ userId: req.user._id }).select('jobId status'),
      ]);
      savedJobIds = saved.map((s) => s.jobId.toString());
      appliedJobIds = applied.map((a) => a.jobId.toString());
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10));

    // Calculate match score for each job
    const jobsWithScores = jobs.map((job) => {
      const match = job.calculateSkillMatch(candidateSkills);
      return {
        _id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        workMode: job.workMode,
        jobType: job.jobType,
        experience: job.experience,
        salary: job.salary,
        requiredSkills: job.requiredSkills,
        preferredSkills: job.preferredSkills,
        applicationDeadline: job.applicationDeadline,
        createdAt: job.createdAt,
        matchPercentage: match.matchPercentage,
        matchedSkillsCount: match.matchedSkills.length,
        missingSkillsCount: match.missingSkills.length,
        isSaved: savedJobIds.includes(job._id.toString()),
        isApplied: appliedJobIds.includes(job._id.toString()),
      };
    });

    // Optionally sort by match percentage
    jobsWithScores.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json({
      success: true,
      count: jobsWithScores.length,
      total: totalJobs,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(totalJobs / parseInt(limit, 10)),
      jobs: jobsWithScores,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job details by ID with transparent skill match breakdown
// @route   GET /api/jobs/:id
// @access  Public / Private
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    let candidateSkills = [];
    let isSaved = false;
    let application = null;

    if (req.user) {
      candidateSkills = req.user.skills || [];
      const [saved, app] = await Promise.all([
        SavedJob.findOne({ userId: req.user._id, jobId: job._id }),
        JobApplication.findOne({ userId: req.user._id, jobId: job._id }),
      ]);
      isSaved = !!saved;
      application = app;
    }

    const match = job.calculateSkillMatch(candidateSkills);

    res.status(200).json({
      success: true,
      job: {
        ...job.toObject(),
        skillMatch: match,
        isSaved,
        application: application
          ? {
              status: application.status,
              appliedAt: application.appliedAt,
              notes: application.notes,
            }
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save/bookmark a job
// @route   POST /api/jobs/:id/save
// @access  Private
const saveJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const userId = req.user._id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const existing = await SavedJob.findOne({ userId, jobId });
    if (existing) {
      return res.status(200).json({ success: true, message: 'Job is already bookmarked.' });
    }

    await SavedJob.create({ userId, jobId });

    res.status(201).json({
      success: true,
      message: 'Job bookmarked to your shortlist.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove job from bookmarks
// @route   DELETE /api/jobs/:id/save
// @access  Private
const unsaveJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const userId = req.user._id;

    await SavedJob.findOneAndDelete({ userId, jobId });

    res.status(200).json({
      success: true,
      message: 'Job removed from your shortlist.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all saved jobs for student
// @route   GET /api/jobs/saved
// @access  Private
const getSavedJobs = async (req, res, next) => {
  try {
    const saved = await SavedJob.find({ userId: req.user._id })
      .populate('jobId')
      .sort({ createdAt: -1 });

    const jobs = saved
      .filter((s) => s.jobId && s.jobId.isActive)
      .map((s) => {
        const match = s.jobId.calculateSkillMatch(req.user.skills || []);
        return {
          ...s.jobId.toObject(),
          matchPercentage: match.matchPercentage,
          savedAt: s.savedAt,
        };
      });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply to a job listing
// @route   POST /api/jobs/:id/apply
// @access  Private
const applyToJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const userId = req.user._id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const existing = await JobApplication.findOne({ userId, jobId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this position.',
      });
    }

    const application = await JobApplication.create({
      userId,
      jobId,
      status: 'applied',
      appliedAt: new Date(),
      notes: req.body.notes || '',
    });

    res.status(201).json({
      success: true,
      message: `Successfully applied to ${job.title} at ${job.company}!`,
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's tracked applications
// @route   GET /api/jobs/applications
// @access  Private
const getApplications = async (req, res, next) => {
  try {
    const applications = await JobApplication.find({ userId: req.user._id })
      .populate('jobId')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  saveJob,
  unsaveJob,
  getSavedJobs,
  applyToJob,
  getApplications,
};
