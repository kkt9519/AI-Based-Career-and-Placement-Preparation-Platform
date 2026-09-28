const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requiredSkills: {
      type: [String],
      required: [true, 'At least one required skill must be specified'],
      default: [],
    },
    preferredSkills: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      index: true,
    },
    workMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'Onsite'],
      default: 'Hybrid',
      index: true,
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Internship', 'Contract'],
      default: 'Full-time',
      index: true,
    },
    experience: {
      type: String,
      default: 'Fresher / 0-1 Years',
    },
    salary: {
      type: String,
      default: 'Competitive for Freshers',
    },
    applicationDeadline: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
    },
    applicationUrl: {
      type: String,
      default: 'https://careers.example.com',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isSampleData: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Helper method to compute transparent skill match for candidate skills
jobSchema.methods.calculateSkillMatch = function (candidateSkills = []) {
  const reqSkills = this.requiredSkills || [];
  const prefSkills = this.preferredSkills || [];

  const candidateLower = candidateSkills.map((s) => s.toLowerCase().trim());

  const matchedRequired = reqSkills.filter((req) =>
    candidateLower.includes(req.toLowerCase().trim())
  );
  const missingRequired = reqSkills.filter(
    (req) => !candidateLower.includes(req.toLowerCase().trim())
  );

  const matchedPreferred = prefSkills.filter((pref) =>
    candidateLower.includes(pref.toLowerCase().trim())
  );
  const missingPreferred = prefSkills.filter(
    (pref) => !candidateLower.includes(pref.toLowerCase().trim())
  );

  // Match calculation: required skills weigh 75%, preferred skills weigh 25%
  let score = 0;
  if (reqSkills.length > 0) {
    score += (matchedRequired.length / reqSkills.length) * 75;
  } else {
    score += 75;
  }

  if (prefSkills.length > 0) {
    score += (matchedPreferred.length / prefSkills.length) * 25;
  } else {
    score += 25;
  }

  const matchPercentage = Math.round(score);

  return {
    matchPercentage,
    matchedSkills: [...matchedRequired, ...matchedPreferred],
    missingSkills: [...missingRequired, ...missingPreferred],
    matchedRequired,
    missingRequired,
    matchedPreferred,
    missingPreferred,
    explanation: `Match score calculated objectively: ${matchedRequired.length}/${reqSkills.length} required skills matched (75% weight) + ${matchedPreferred.length}/${Math.max(prefSkills.length, 1)} preferred skills matched (25% weight). Note: This is an analytical preparation score, not an employer decision.`,
  };
};

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
