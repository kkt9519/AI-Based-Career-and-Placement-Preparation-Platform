const request = require('supertest');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const app = require('../src/app');
const User = require('../src/models/User');
const Resume = require('../src/models/Resume');
const ResumeAnalysis = require('../src/models/ResumeAnalysis');
const CareerRoadmap = require('../src/models/CareerRoadmap');

const TEST_MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerpilot_ai_test';

let studentToken = '';
let studentId = '';
let testResumeId = '';
let roadmapId = '';
let milestoneId = '';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_MONGO_URI);
  }

  // Create clean test student
  await User.deleteMany({ email: 'phase3test@careerpilot.ai' });
  const user = await User.create({
    name: 'Phase Three Student',
    email: 'phase3test@careerpilot.ai',
    password: 'Password123!',
    role: 'student',
    targetRole: 'MERN Stack Developer',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
  });
  studentId = user._id;

  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'phase3test@careerpilot.ai',
    password: 'Password123!',
  });
  studentToken = loginRes.body.token;

  // Create a mock resume document
  const resume = await Resume.create({
    userId: studentId,
    fileName: 'resume-test.pdf',
    originalName: 'Alex_Chen_MERN_Resume.pdf',
    fileType: 'pdf',
    fileSize: 10240,
    storagePath: path.resolve(__dirname, 'mock_resume.pdf'),
    extractedText: `
      Alex Chen - Computer Science & Design Undergraduate
      Skills: JavaScript, React, Node.js, Express, MongoDB, Git, HTML, CSS, Tailwind.
      Education: B.Tech in Computer Science and Design, CGPA 8.7.
      Projects:
      - Placement Portal Platform: Built full stack MERN web application with 200+ users.
      - E-Commerce Store: Developed REST APIs and integrated Stripe payments.
    `,
  });
  testResumeId = resume._id;
});

afterAll(async () => {
  await ResumeAnalysis.deleteMany({ userId: studentId });
  await CareerRoadmap.deleteMany({ userId: studentId });
  await Resume.deleteMany({ userId: studentId });
  await User.deleteMany({ email: 'phase3test@careerpilot.ai' });
  await mongoose.connection.close();
});

describe('Phase 3: AI Resume Analyzer & Career Roadmap APIs', () => {
  test('POST /api/resumes/:id/analyze - Should analyze resume and return structured ATS feedback', async () => {
    const res = await request(app)
      .post(`/api/resumes/${testResumeId}/analyze`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ targetRole: 'MERN Stack Developer' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.analysis).toBeDefined();
    expect(res.body.analysis.overallScore).toBeGreaterThanOrEqual(40);
    expect(res.body.analysis.categoryScores.skills).toBeDefined();
    expect(res.body.analysis.skillsIdentified.length).toBeGreaterThan(0);
    expect(Array.isArray(res.body.analysis.missingSkills)).toBe(true);
    expect(Array.isArray(res.body.analysis.recommendations)).toBe(true);
    expect(res.body.analysis.roleFitSummary).toBeDefined();
  });

  test('GET /api/resumes/analyses/history - Should retrieve past analysis history', async () => {
    const res = await request(app)
      .get('/api/resumes/analyses/history')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.analyses.length).toBeGreaterThanOrEqual(1);
    expect(res.body.analyses[0].overallScore).toBeDefined();
  });

  test('GET /api/career/roadmap - Should retrieve or auto-generate personalized roadmap', async () => {
    const res = await request(app)
      .get('/api/career/roadmap')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.roadmap).toBeDefined();
    expect(res.body.roadmap.milestones.length).toBeGreaterThanOrEqual(3);
    expect(res.body.roadmap.overallProgress).toBeDefined();

    roadmapId = res.body.roadmap._id;
    milestoneId = res.body.roadmap.milestones[1]._id; // pick second milestone
  });

  test('PATCH /api/career/roadmap/:id/milestone/:milestoneId - Should toggle milestone progress', async () => {
    const res = await request(app)
      .patch(`/api/career/roadmap/${roadmapId}/milestone/${milestoneId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.roadmap).toBeDefined();
    const updatedMilestone = res.body.roadmap.milestones.find((m) => m._id.toString() === milestoneId.toString());
    expect(updatedMilestone.completed).toBe(true);
  });

  test('POST /api/career/roadmap - Should regenerate roadmap for Java Developer role', async () => {
    const res = await request(app)
      .post('/api/career/roadmap')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        targetRole: 'Java Developer',
        currentSkills: ['Java', 'Git'],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.roadmap.targetRole).toBe('Java Developer');
    expect(res.body.roadmap.milestones[0].title).toContain('Java');
  });
});
