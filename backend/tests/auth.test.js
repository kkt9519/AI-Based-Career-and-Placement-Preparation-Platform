const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

describe('Secure Authentication & Authorization Suite', () => {
  const testStudent = {
    name: 'Jane Doe',
    email: 'jane@testauth.com',
    password: 'Password123!',
    targetRole: 'Frontend Developer',
    skills: ['React', 'JavaScript', 'CSS'],
  };

  let studentToken = '';
  let authCookie = '';

  describe('1. Student Registration & Validation', () => {
    test('POST /api/auth/register - Successfully registers student and issues HttpOnly cookie', async () => {
      const res = await request(app).post('/api/auth/register').send(testStudent);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(testStudent.email);
      expect(res.body.user.role).toBe('student');
      expect(res.body.user.password).toBeUndefined();

      // Check HttpOnly cookie in Set-Cookie header
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const tokenCookie = cookies.find((c) => c.startsWith('token='));
      expect(tokenCookie).toBeDefined();
      expect(tokenCookie).toMatch(/HttpOnly/i);

      // Extract raw cookie string for subsequent tests
      authCookie = tokenCookie.split(';')[0];
    });

    test('Password Hashing - Verifies password is never stored as plain text in MongoDB', async () => {
      const savedUser = await User.findOne({ email: testStudent.email }).select('+password');
      expect(savedUser).not.toBeNull();
      expect(savedUser.password).not.toBe(testStudent.password);
      expect(savedUser.password).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash format

      // Verify bcrypt comparison succeeds
      const isMatch = await bcrypt.compare(testStudent.password, savedUser.password);
      expect(isMatch).toBe(true);
    });

    test('Privilege Escalation Defense - Disallows self-assigning admin role in public registration', async () => {
      const maliciousPayload = {
        name: 'Attacker User',
        email: 'attacker@testauth.com',
        password: 'Password123!',
        role: 'admin',
      };

      const res = await request(app).post('/api/auth/register').send(maliciousPayload);

      // Either rejected by Zod validation (400) or forced to student role
      if (res.status === 201) {
        expect(res.body.user.role).toBe('student');
        const dbUser = await User.findOne({ email: maliciousPayload.email });
        expect(dbUser.role).toBe('student');
      } else {
        expect(res.status).toBe(400);
      }
    });

    test('POST /api/auth/register - Fails on duplicate email with 409 Conflict', async () => {
      const res = await request(app).post('/api/auth/register').send(testStudent);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already exists/i);
    });

    test('POST /api/auth/register - Fails validation on short password with 400', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Bad Pass',
        email: 'badpass@testauth.com',
        password: '123',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    test('POST /api/auth/register - Fails validation on invalid email with 400', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Bad Email',
        email: 'not-an-email',
        password: 'Password123!',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('2. Login & Authentication Security', () => {
    test('POST /api/auth/login - Successfully logs in with correct credentials & sets HttpOnly cookie', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testStudent.email,
        password: testStudent.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      studentToken = res.body.token;
      expect(res.body.user.email).toBe(testStudent.email);

      // Verify Set-Cookie header
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const tokenCookie = cookies.find((c) => c.startsWith('token='));
      expect(tokenCookie).toBeDefined();
      expect(tokenCookie).toMatch(/HttpOnly/i);

      authCookie = tokenCookie.split(';')[0];
    });

    test('POST /api/auth/login - Rejects incorrect password with safe 401 error', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testStudent.email,
        password: 'WrongPassword456!',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password.');
    });

    test('POST /api/auth/login - Rejects non-existent email with safe 401 error', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@testauth.com',
        password: 'Password123!',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password.');
    });
  });

  describe('3. Protected Endpoints (Cookie & Bearer Header)', () => {
    test('GET /api/auth/me - Authenticates successfully via HttpOnly Cookie', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', [authCookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(testStudent.email);
    });

    test('GET /api/auth/me - Authenticates successfully via Bearer Token header', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(testStudent.email);
    });

    test('GET /api/auth/me - Rejects unauthorized requests when no cookie or header is provided', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/No authentication token provided/i);
    });

    test('GET /api/users/dashboard - Backend protects student dashboard endpoint', async () => {
      // Unauthenticated request should be rejected
      const unauthRes = await request(app).get('/api/users/dashboard');
      expect(unauthRes.status).toBe(401);

      // Authenticated with cookie should succeed
      const authRes = await request(app)
        .get('/api/users/dashboard')
        .set('Cookie', [authCookie]);

      expect(authRes.status).toBe(200);
      expect(authRes.body.success).toBe(true);
      expect(authRes.body.stats).toBeDefined();
    });
  });

  describe('4. Logout Session Termination', () => {
    test('POST /api/auth/logout - Clears the session cookie', async () => {
      const res = await request(app).post('/api/auth/logout');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const tokenCookie = cookies.find((c) => c.startsWith('token='));
      expect(tokenCookie).toBeDefined();
      // Should have expired date or max-age 0
      expect(tokenCookie).toMatch(/Expires=Thu, 01 Jan 1970|Max-Age=0/i);
    });
  });

  describe('5. Password Reset Lifecycle', () => {
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
});
