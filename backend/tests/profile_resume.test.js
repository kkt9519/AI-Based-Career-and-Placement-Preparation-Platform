const request = require('supertest');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const app = require('../src/app');
const User = require('../src/models/User');
const Resume = require('../src/models/Resume');

const TEST_MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerpilot_ai_test';

let studentToken = '';
let studentId = '';
let uploadedResumeId = '';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_MONGO_URI);
  }

  // Create a clean test user
  await User.deleteMany({ email: 'profiletest@careerpilot.ai' });
  const user = await User.create({
    name: 'Profile Tester',
    email: 'profiletest@careerpilot.ai',
    password: 'Password123!',
    role: 'student',
    targetRole: 'MERN Stack Developer',
    skills: ['React', 'Node.js'],
  });
  studentId = user._id;

  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'profiletest@careerpilot.ai',
    password: 'Password123!',
  });
  studentToken = loginRes.body.token;
});

afterAll(async () => {
  // Clean up resumes
  const resumes = await Resume.find({ userId: studentId });
  for (const r of resumes) {
    if (fs.existsSync(r.storagePath)) {
      try {
        fs.unlinkSync(r.storagePath);
      } catch (e) {}
    }
  }
  await Resume.deleteMany({ userId: studentId });
  await User.deleteMany({ email: 'profiletest@careerpilot.ai' });
  await mongoose.connection.close();
});

describe('Phase 2: Profile & Resume APIs', () => {
  test('GET /api/users/profile - Should retrieve student profile', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe('profiletest@careerpilot.ai');
    expect(res.body.user.profileCompletion).toBeDefined();
  });

  test('PUT /api/users/profile - Should update profile fields and recalculate completion', async () => {
    const updateData = {
      targetRole: 'Full Stack Developer',
      careerGoals: 'Lead engineering teams at top tech firms.',
      skills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'TypeScript', 'Docker'],
      profile: {
        college: 'National Institute of Technology',
        degree: 'B.Tech',
        branch: 'Computer Science',
        graduationYear: 2026,
        cgpa: 9.1,
        bio: 'Full-stack software developer with high interest in system design.',
        githubUrl: 'https://github.com/profiletest',
        linkedinUrl: 'https://linkedin.com/in/profiletest',
      },
    };

    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${studentToken}`)
      .send(updateData);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.targetRole).toBe('Full Stack Developer');
    expect(res.body.user.skills).toHaveLength(6);
    expect(res.body.user.profile.cgpa).toBe(9.1);
    expect(res.body.user.profileCompletion).toBe(100);
  });

  test('GET /api/users/dashboard - Should return real dashboard aggregates', async () => {
    const res = await request(app)
      .get('/api/users/dashboard')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.stats).toBeDefined();
    expect(res.body.stats.targetRole).toBe('Full Stack Developer');
    expect(res.body.stats.profileCompletion).toBe(100);
    expect(Array.isArray(res.body.stats.recentActivities)).toBe(true);
  });

  test('POST /api/resumes/upload - Should reject if no file provided', async () => {
    const res = await request(app)
      .post('/api/resumes/upload')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/resumes/upload - Should upload a valid PDF and extract text', async () => {
    // We can use the existing sample PDF in the workspace
    const samplePdfPath = path.resolve(__dirname, '../../HCLTech_JD - GET Dev.pdf');

    if (fs.existsSync(samplePdfPath)) {
      const res = await request(app)
        .post('/api/resumes/upload')
        .set('Authorization', `Bearer ${studentToken}`)
        .attach('resume', samplePdfPath);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.resume).toBeDefined();
      expect(res.body.resume.fileType).toBe('pdf');
      expect(res.body.resume.textLength).toBeGreaterThan(0);
      expect(res.body.resume.extractedTextPreview).toBeDefined();

      uploadedResumeId = res.body.resume._id;
    }
  });

  test('GET /api/resumes - Should list uploaded resumes for student', async () => {
    const res = await request(app)
      .get('/api/resumes')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.resumes)).toBe(true);
    if (uploadedResumeId) {
      expect(res.body.resumes.length).toBeGreaterThan(0);
    }
  });

  test('GET /api/resumes/:id - Should get specific resume by ID', async () => {
    if (!uploadedResumeId) return;

    const res = await request(app)
      .get(`/api/resumes/${uploadedResumeId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.resume._id).toBe(uploadedResumeId);
  });

  test('DELETE /api/resumes/:id - Should delete uploaded resume', async () => {
    if (!uploadedResumeId) return;

    const res = await request(app)
      .delete(`/api/resumes/${uploadedResumeId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify it is gone
    const checkRes = await request(app)
      .get(`/api/resumes/${uploadedResumeId}`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(checkRes.status).toBe(404);
  });
});
