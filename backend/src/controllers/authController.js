const crypto = require('crypto');
const User = require('../models/User');
const { generateToken } = require('../utils/token');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../validators/authValidator');

// Helper to sign JWT and attach secure HttpOnly cookie
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id, user.role);

  const cookieExpiresDays = parseInt(process.env.COOKIE_EXPIRES_DAYS, 10) || 7;
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + cookieExpiresDays * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  };

  res.cookie('token', token, cookieOptions);

  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    targetRole: user.targetRole,
    skills: user.skills,
    profile: user.profile,
    profileCompletion: typeof user.calculateProfileCompletion === 'function' ? user.calculateProfileCompletion() : 0,
    createdAt: user.createdAt,
  };

  res.status(statusCode).json({
    success: true,
    message,
    token, // Provided for backwards compatibility with test suites & tools
    user: userResponse,
  });
};

// @desc    Register a new student user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Force role: 'student' to strictly prevent self-assignment of admin privileges
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
      role: 'student',
      targetRole: validatedData.targetRole || 'Software Engineer',
      skills: validatedData.skills || [],
    });

    sendTokenResponse(user, 201, res, 'Account registered successfully.');
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token with HttpOnly cookie
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    // Explicitly select password field since it is set to select: false
    const user = await User.findOne({ email: validatedData.email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(validatedData.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (user.accountStatus === 'inactive') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact an administrator.',
      });
    }

    sendTokenResponse(user, 200, res, 'Logged in successfully.');
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently authenticated user details
// @route   GET /api/auth/me
// @access  Private (Student & Admin)
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
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
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log out user / clear session cookie
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

// @desc    Generate password reset token
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const validatedData = forgotPasswordSchema.parse(req.body);

    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      // Return 200 with standard message to prevent email enumeration attacks
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset token has been generated.',
      });
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour validity
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset token generated successfully.',
      // Providing resetToken in response for local development / viva demo
      resetToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);

    const hashedToken = crypto.createHash('sha256').update(validatedData.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Reset token is invalid or has expired.',
      });
    }

    user.password = validatedData.password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
};
