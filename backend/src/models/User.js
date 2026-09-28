const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
      index: true,
    },
    accountStatus: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      index: true,
    },
    targetRole: {
      type: String,
      default: 'Software Engineer',
      trim: true,
    },
    careerGoals: {
      type: String,
      default: '',
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    profile: {
      phone: { type: String, default: '' },
      college: { type: String, default: '' },
      degree: { type: String, default: 'B.Tech' },
      branch: { type: String, default: 'Computer Science and Design' },
      graduationYear: { type: Number, default: 2026 },
      cgpa: { type: Number, min: 0, max: 10, default: 0 },
      bio: { type: String, default: '', maxlength: 500 },
      location: { type: String, default: '' },
      githubUrl: { type: String, default: '' },
      linkedinUrl: { type: String, default: '' },
      portfolioUrl: { type: String, default: '' },
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate profile completion percentage
userSchema.methods.calculateProfileCompletion = function () {
  const fieldsToCheck = [
    this.name,
    this.email,
    this.targetRole,
    this.skills && this.skills.length > 0,
    this.profile?.college,
    this.profile?.degree,
    this.profile?.branch,
    this.profile?.graduationYear,
    this.profile?.cgpa && this.profile.cgpa > 0,
    this.profile?.bio,
    this.profile?.githubUrl || this.profile?.linkedinUrl,
  ];

  const completed = fieldsToCheck.filter(Boolean).length;
  return Math.round((completed / fieldsToCheck.length) * 100);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
