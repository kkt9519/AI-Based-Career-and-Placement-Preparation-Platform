const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Job = require('../src/models/Job');
const Question = require('../src/models/Question');

const TEST_MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerpilot_ai_test';

let adminToken = '';
let studentToken = '';
let targetStudentId = '';
let createdJobId = '';
let createdQuestionId = '';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_MONGO_URI);
  }

  // Create clean admin user
  await User.deleteMany({ email: { $in: ['admintest@careerpilot.ai', 'teststudentadmin@careerpilot.ai'] } });
  await User.create({
    name: 'Admin Test User',
    email: 'admintest@careerpilot.ai',
    password: 'AdminPassword123!',
    role: 'admin',
  });

  const adminLogin = await request(app).post('/api/auth/login').send({
    email: 'admintest@careerpilot.ai',
    password: 'AdminPassword123!',
  });
  adminToken = adminLogin.body.token;

  // Create a regular student to test RBAC and user management
  const student = await User.create({
    name: 'Student Subject',
    email: 'teststudentadmin@careerpilot.ai',
    password: 'StudentPassword123!',
    role: 'student',
  });
  targetStudentId = student._id;

  const studentLogin = await request(app).post('/api/auth/login').send({
    email: 'teststudentadmin@careerpilot.ai',
    password: 'StudentPassword123!',
  });
  studentToken = studentLogin.body.token;
});

afterAll(async () => {
  await Job.deleteMany({ company: 'Admin Test Company' });
  await Question.deleteMany({ tags: 'admin-test' });
  await User.deleteMany({ email: { $in: ['admintest@careerpilot.ai', 'teststudentadmin@careerpilot.ai'] } });
  await mongoose.connection.close();
});

describe('Phase 7: Admin Console & Platform Management APIs', () => {
  it('GET /api/admin/dashboard - should forbid non-admin users', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/admin/dashboard - should return live platform aggregate counts for admin', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalUsers).toBeGreaterThanOrEqual(2);
    expect(res.body.data.totalStudents).toBeGreaterThanOrEqual(1);
    expect(typeof res.body.data.averageInterviewScore).toBe('number');
    expect(Array.isArray(res.body.data.recentSignups)).toBe(true);
  });

  it('GET /api/admin/users - should list users with pagination', async () => {
    const res = await request(app)
      .get('/api/admin/users?role=student')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('PATCH /api/admin/users/:id/status - should update user status', async () => {
    const res = await request(app)
      .patch(`/api/admin/users/${targetStudentId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isActive: false });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isActive).toBe(false);

    // Re-enable
    await request(app)
      .patch(`/api/admin/users/${targetStudentId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isActive: true });
  });

  it('POST /api/admin/jobs - should create a new job posting', async () => {
    const res = await request(app)
      .post('/api/admin/jobs')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Admin Created Engineer',
        company: 'Admin Test Company',
        description: 'Building high throughput systems.',
        requiredSkills: ['Node.js', 'MongoDB', 'Docker'],
        location: 'Hyderabad, India',
        workMode: 'Hybrid',
        jobType: 'Full-time',
        salary: '₹12,00,000 / year',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBeDefined();
    createdJobId = res.body.data._id;
  });

  it('PUT /api/admin/jobs/:id - should update existing job posting', async () => {
    const res = await request(app)
      .put(`/api/admin/jobs/${createdJobId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        salary: '₹14,00,000 / year',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.salary).toBe('₹14,00,000 / year');
  });

  it('DELETE /api/admin/jobs/:id - should remove job posting', async () => {
    const res = await request(app)
      .delete(`/api/admin/jobs/${createdJobId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/admin/questions - should add a question to question bank', async () => {
    const res = await request(app)
      .post('/api/admin/questions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Admin Created Test MCQ',
        category: 'CS Core',
        difficulty: 'Easy',
        type: 'mcq',
        options: [
          { optionId: 'opt-1', text: 'Option A', isCorrect: true },
          { optionId: 'opt-2', text: 'Option B', isCorrect: false },
        ],
        explanation: 'Option A is technically valid.',
        tags: ['admin-test'],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBeDefined();
    createdQuestionId = res.body.data._id;
  });

  it('DELETE /api/admin/questions/:id - should delete question', async () => {
    const res = await request(app)
      .delete(`/api/admin/questions/${createdQuestionId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
