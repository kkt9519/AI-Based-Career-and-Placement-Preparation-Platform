const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

const TEST_MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerpilot_ai_test';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_MONGO_URI);
  }
  await User.deleteMany({ email: /@testauth\.com$/ });
});

afterAll(async () => {
  await User.deleteMany({ email: /@testauth\.com$/ });
  await mongoose.connection.close();
});

describe('Phase 1: Authentication & Authorization APIs', () => {
  const testStudent = {
    name: 'Jane Doe',
    email: 'jane@testauth.com',
    password: 'Password123!',
    role: 'student',
    targetRole: 'Frontend Developer',
    skills: ['React', 'JavaScript', 'CSS'],
  };

  let studentToken = '';

  test('POST /api/auth/register - Should register a new student user', async () => {
    const res = await request(app).post('/api/auth/register').send(testStudent);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testStudent.email);
    expect(res.body.user.role).toBe('student');
    expect(res.body.user.password).toBeUndefined();
    expect(res.body.user.profileCompletion).toBeGreaterThan(0);
  });

  test('POST /api/auth/register - Should fail on duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(testStudent);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/register - Should fail validation on short password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Bad Pass',
      email: 'badpass@testauth.com',
      password: '123',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  test('POST /api/auth/login - Should successfully log in with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testStudent.email,
      password: testStudent.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    studentToken = res.body.token;
    expect(res.body.user.email).toBe(testStudent.email);
  });

  test('POST /api/auth/login - Should reject incorrect password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testStudent.email,
      password: 'WrongPassword456!',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/auth/me - Should return current user profile when authorized', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(testStudent.email);
    expect(res.body.user.targetRole).toBe(testStudent.targetRole);
  });

  test('GET /api/auth/me - Should reject unauthorized requests without token', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/forgot-password & reset-password flow', async () => {
    const forgotRes = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: testStudent.email });

    expect(forgotRes.status).toBe(200);
    expect(forgotRes.body.success).toBe(true);
    expect(forgotRes.body.resetToken).toBeDefined();

    const resetToken = forgotRes.body.resetToken;

    const resetRes = await request(app).post('/api/auth/reset-password').send({
      token: resetToken,
      password: 'NewStrongPassword456!',
    });

    expect(resetRes.status).toBe(200);
    expect(resetRes.body.success).toBe(true);

    // Verify login works with new password
    const loginRes = await request(app).post('/api/auth/login').send({
      email: testStudent.email,
      password: 'NewStrongPassword456!',
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
  });
});
