const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Question = require('../src/models/Question');
const Assessment = require('../src/models/Assessment');

const TEST_MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerpilot_ai_test';

let studentToken = '';
let studentId = '';
let assessmentId = '';
let testQuestion = null;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_MONGO_URI);
  }

  // Create clean test student
  await User.deleteMany({ email: 'assessmenttest@careerpilot.ai' });
  const user = await User.create({
    name: 'Aptitude Tester',
    email: 'assessmenttest@careerpilot.ai',
    password: 'Password123!',
    role: 'student',
    targetRole: 'MERN Stack Developer',
    skills: ['JavaScript', 'React', 'Node.js'],
  });
  studentId = user._id;

  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'assessmenttest@careerpilot.ai',
    password: 'Password123!',
  });
  studentToken = loginRes.body.token;

  // Ensure test questions exist
  await Question.deleteMany({ tags: 'test-seed-suite' });
  testQuestion = await Question.create({
    title: 'Test Sample MCQ Problem',
    description: 'What is the output of 2 + 2?',
    category: 'Quantitative',
    difficulty: 'Easy',
    type: 'mcq',
    options: [
      { optionId: 'opt-a', text: '3', isCorrect: false },
      { optionId: 'opt-b', text: '4', isCorrect: true },
      { optionId: 'opt-c', text: '5', isCorrect: false },
    ],
    explanation: 'Basic arithmetic dictates 2 + 2 = 4.',
    tags: ['test-seed-suite'],
  });
});

afterAll(async () => {
  await Assessment.deleteMany({ userId: studentId });
  await Question.deleteMany({ tags: 'test-seed-suite' });
  await User.deleteMany({ email: 'assessmenttest@careerpilot.ai' });
  await mongoose.connection.close();
});

describe('Phase 6: Aptitude & Coding Practice APIs', () => {
  it('GET /api/assessments/questions - should fetch sanitized questions without exposing answers', async () => {
    const res = await request(app)
      .get('/api/assessments/questions?category=Quantitative')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    // Verify answers are stripped for integrity
    const firstQ = res.body.data[0];
    expect(firstQ.explanation).toBeUndefined();
    if (firstQ.options && firstQ.options.length > 0) {
      expect(firstQ.options[0].isCorrect).toBeUndefined();
    }
  });

  it('POST /api/assessments/start - should reject unauthenticated request', async () => {
    const res = await request(app).post('/api/assessments/start').send({
      category: 'Quantitative',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/assessments/start - should start a timed assessment session', async () => {
    const res = await request(app)
      .post('/api/assessments/start')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        category: 'Quantitative',
        difficulty: 'Easy',
        totalQuestions: 2,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.assessmentId).toBeDefined();
    expect(res.body.data.totalQuestions).toBeGreaterThanOrEqual(1);
    expect(res.body.data.allocatedTimeMinutes).toBeGreaterThan(0);
    expect(res.body.data.questions.length).toBeGreaterThanOrEqual(1);

    assessmentId = res.body.data.assessmentId;
  });

  it('POST /api/assessments/:id/submit - should evaluate answers, score test and return explanations', async () => {
    const res = await request(app)
      .post(`/api/assessments/${assessmentId}/submit`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        answers: [
          {
            questionId: testQuestion._id,
            selectedOptionId: 'opt-b', // Correct option
            timeTakenSeconds: 30,
          },
        ],
        timeSpentSeconds: 45,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.score).toBeGreaterThanOrEqual(0);
    expect(res.body.data.percentage).toBeDefined();
    expect(res.body.data.questionReview).toBeDefined();
    expect(Array.isArray(res.body.data.questionReview)).toBe(true);
  });

  it('GET /api/assessments/history - should list student assessment history', async () => {
    const res = await request(app)
      .get('/api/assessments/history')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/assessments/stats - should return student performance analytics', async () => {
    const res = await request(app)
      .get('/api/assessments/stats')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalAssessments).toBeGreaterThanOrEqual(1);
    expect(res.body.data.categoryBreakdown).toBeDefined();
    expect(typeof res.body.data.categoryBreakdown.Quantitative).toBe('number');
  });

  it('GET /api/assessments/:id - should get detailed session review', async () => {
    const res = await request(app)
      .get(`/api/assessments/${assessmentId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(assessmentId);
    expect(res.body.data.isCompleted).toBe(true);
  });
});
