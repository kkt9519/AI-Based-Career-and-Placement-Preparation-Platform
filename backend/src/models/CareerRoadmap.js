const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  topics: {
    type: [String],
    default: [],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  resources: {
    type: [String],
    default: [],
  },
});

const recommendedProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  techStack: {
    type: [String],
    default: [],
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate',
  },
});

const careerRoadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetRole: {
      type: String,
      required: true,
      default: 'MERN Stack Developer',
    },
    currentSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    milestones: [milestoneSchema],
    recommendedProjects: [recommendedProjectSchema],
    overallProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Method to calculate overall progress from completed milestones
careerRoadmapSchema.methods.calculateProgress = function () {
  if (!this.milestones || this.milestones.length === 0) return 0;
  const completedCount = this.milestones.filter((m) => m.completed).length;
  this.overallProgress = Math.round((completedCount / this.milestones.length) * 100);
  return this.overallProgress;
};

const CareerRoadmap = mongoose.model('CareerRoadmap', careerRoadmapSchema);

module.exports = CareerRoadmap;
