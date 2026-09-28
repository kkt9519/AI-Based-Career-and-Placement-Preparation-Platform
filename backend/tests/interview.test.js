const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const InterviewSession = require('../src/models/InterviewSession');

const TEST_MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerpilot_ai_test';

let studentToken = '';
let studentId = '';
let sessionId = '';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_MONGO_URI);
  }

  // Create clean test student
  await User.deleteMany({ email: 'interviewtest@careerpilot.ai' });
  const user = await User.create({
    name: 'Interview Candidate',
    email: 'interviewtest@careerpilot.ai',
    password: 'Password123!',
    role: 'student',
    targetRole: 'MERN Stack Developer',
    skills: ['JavaScript', 'React', 'Node.js'],
  });
  studentId = user._id;

  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'interviewtest@careerpilot.ai',
    password: 'Password123!',
  });
  studentToken = loginRes.body.token;
});

afterAll(async () => {
  await InterviewSession.deleteMany({ userId: studentId });
  await User.deleteMany({ email: 'interviewtest@careerpilot.ai' });
  await mongoose.connection.close();
});

describe('AI Mock Interview System APIs', () => {
  it('should reject unauthenticated request to start an interview', async () => {
    const res = await request(app).post('/api/interviews/start').send({
      interviewType: 'Technical',
      role: 'MERN Stack Developer',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should start a new mock interview session with generated questions', async () => {
    const res = await request(app)
      .post('/api/interviews/start')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        interviewType: 'Technical',
        role: 'MERN Stack Developer',
        difficulty: 'Intermediate',
        totalQuestions: 2,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.sessionId).toBeDefined();
    expect(res.body.data.currentQuestion).toBeDefined();
    expect(res.body.data.currentQuestion.questionText).toBeTruthy();
    expect(res.body.data.totalQuestions).toBe(2);

    sessionId = res.body.data.sessionId;
  });

  it('should reject empty answer text', async () => {
    const res = await request(app)
      .post(`/api/interviews/${sessionId}/answer`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        questionIndex: 0,
        userAnswer: '   ',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should evaluate answer with scores across 5 criteria', async () => {
    const res = await request(app)
      .post(`/api/interviews/${sessionId}/answer`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        questionIndex: 0,
        userAnswer:
          'The Virtual DOM is a lightweight JavaScript representation of the actual DOM in memory. React uses a diffing algorithm to compare the new virtual tree with the previous one, and batches updates to update only the changed nodes in the real DOM, which avoids expensive reflows and repaints.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.evaluation).toBeDefined();
    expect(res.body.data.evaluation.score).toBeGreaterThanOrEqual(1);
    expect(res.body.data.evaluation.criteriaScores).toBeDefined();
    expect(res.body.data.evaluation.criteriaScores.relevance).toBeGreaterThan(0);
    expect(res.body.data.evaluation.criteriaScores.technicalAccuracy).toBeGreaterThan(0);
    expect(res.body.data.evaluation.feedback).toBeTruthy();
    expect(res.body.data.currentQuestionIndex).toBe(1);
  });

  it('should finish interview and compute final score report', async () => {
    const res = await request(app)
      .post(`/api/interviews/${sessionId}/finish`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isCompleted).toBe(true);
    expect(res.body.data.finalScore).toBeGreaterThanOrEqual(0);
    expect(res.body.data.overallFeedback).toBeTruthy();
  });

  it('should fetch student interview history', async () => {
    const res = await request(app)
      .get('/api/interviews/history')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('should fetch single interview session details', async () => {
    const res = await request(app)
      .get(`/api/interviews/${sessionId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(sessionId);
    expect(res.body.data.answers.length).toBeGreaterThan(0);
  });
});
