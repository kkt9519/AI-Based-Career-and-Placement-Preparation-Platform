require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedUsers = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerpilot_ai';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB for seeding users.');

    // Clear existing users to avoid conflicts
    await User.deleteMany({ email: { $in: ['admin@careerpilot.ai', 'student@careerpilot.ai'] } });

    // Seed Admin
    const admin = await User.create({
      name: 'Platform Administrator',
      email: 'admin@careerpilot.ai',
      password: 'AdminPassword123!',
      role: 'admin',
      targetRole: 'Engineering Manager',
      skills: ['System Design', 'Cloud Architecture', 'Leadership', 'Full Stack Development'],
      profile: {
        college: 'National Institute of Technology',
        degree: 'M.Tech',
        branch: 'Computer Science and Engineering',
        graduationYear: 2020,
        cgpa: 9.4,
        bio: 'Lead System Architect & Placement Administrator at CareerPilot AI.',
        location: 'Bengaluru, India',
        githubUrl: 'https://github.com/careerpilot-admin',
        linkedinUrl: 'https://linkedin.com/in/careerpilot-admin',
      },
    });

    // Seed Student
    const student = await User.create({
      name: 'Alex Chen',
      email: 'student@careerpilot.ai',
      password: 'StudentPassword123!',
      role: 'student',
      targetRole: 'MERN Stack Developer',
      careerGoals: 'Secure a Full Stack Developer role at a high-growth tech product company.',
      skills: ['JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Git', 'REST APIs'],
      profile: {
        phone: '+91 98765 43210',
        college: 'City Institute of Technology',
        degree: 'B.Tech',
        branch: 'Computer Science and Design',
        graduationYear: 2026,
        cgpa: 8.7,
        bio: 'Final year Computer Science and Design undergraduate passionate about full-stack web applications, distributed systems, and modern UI/UX design.',
        location: 'Bangalore, India',
        githubUrl: 'https://github.com/alexchen-dev',
        linkedinUrl: 'https://linkedin.com/in/alexchen-dev',
        portfolioUrl: 'https://alexchen.dev',
      },
    });

    console.log(`[Seed] Successfully seeded Admin: ${admin.email}`);
    console.log(`[Seed] Successfully seeded Student: ${student.email}`);
    console.log('[Seed] User seeding complete.');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`[Seed] Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedUsers();
