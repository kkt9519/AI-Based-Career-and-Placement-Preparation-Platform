const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Job = require('../src/models/Job');
const SavedJob = require('../src/models/SavedJob');
const JobApplication = require('../src/models/JobApplication');

const TEST_MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerpilot_ai_test';

let studentToken = '';
let studentId = '';
let sampleJobId = '';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_MONGO_URI);
  }

  // Create clean test student
  await User.deleteMany({ email: 'jobstest@careerpilot.ai' });
  const user = await User.create({
    name: 'Job Hunter',
    email: 'jobstest@careerpilot.ai',
    password: 'Password123!',
    role: 'student',
    targetRole: 'MERN Stack Developer',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express.js'],
  });
  studentId = user._id;

  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'jobstest@careerpilot.ai',
    password: 'Password123!',
  });
  studentToken = loginRes.body.token;

  // Create test job
  const job = await Job.create({
    title: 'Test Software Engineer',
    company: 'Test Tech Corp',
    description: 'Developing cloud applications with React and Node.js.',
    requiredSkills: ['React', 'Node.js', 'JavaScript'],
    preferredSkills: ['MongoDB', 'Docker'],
    location: 'Bengaluru, India',
    workMode: 'Hybrid',
    jobType: 'Full-time',
    salary: '₹8,00,000 / year',
    isActive: true,
  });
  sampleJobId = job._id;
});

afterAll(async () => {
  await SavedJob.deleteMany({ userId: studentId });
  await JobApplication.deleteMany({ userId: studentId });
  await Job.deleteMany({ company: 'Test Tech Corp' });
  await User.deleteMany({ email: 'jobstest@careerpilot.ai' });
  await mongoose.connection.close();
});

describe('Phase 4: Job & Internship Portal APIs', () => {
  test('GET /api/jobs - Should retrieve jobs and compute match percentage', async () => {
    const res = await request(app)
      .get('/api/jobs')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.jobs)).toBe(true);
    expect(res.body.jobs.length).toBeGreaterThan(0);

    const testJob = res.body.jobs.find((j) => j._id.toString() === sampleJobId.toString());
    expect(testJob).toBeDefined();
    // Candidate has React, Node.js, JavaScript, and MongoDB -> match should be high (>85%)
    expect(testJob.matchPercentage).toBeGreaterThanOrEqual(80);
  });

  test('GET /api/jobs/:id - Should get job details with transparent match explanation', async () => {
    const res = await request(app)
      .get(`/api/jobs/${sampleJobId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.job.skillMatch).toBeDefined();
    expect(res.body.job.skillMatch.matchedRequired.length).toBe(3); // React, Node.js, JavaScript
    expect(res.body.job.skillMatch.explanation).toContain('Match score calculated objectively');
  });

  test('POST /api/jobs/:id/save - Should bookmark a job', async () => {
    const res = await request(app)
      .post(`/api/jobs/${sampleJobId}/save`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/jobs/saved - Should list bookmarked jobs', async () => {
    const res = await request(app)
      .get('/api/jobs/saved')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.jobs.length).toBeGreaterThan(0);
  });

  test('DELETE /api/jobs/:id/save - Should remove bookmark', async () => {
    const res = await request(app)
      .delete(`/api/jobs/${sampleJobId}/save`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/jobs/:id/apply - Should submit application and track status', async () => {
    const res = await request(app)
      .post(`/api/jobs/${sampleJobId}/apply`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ notes: 'Excited about the full-stack engineering team.' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.application.status).toBe('applied');

    // Duplicate application check
    const dupRes = await request(app)
      .post(`/api/jobs/${sampleJobId}/apply`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(dupRes.status).toBe(400);
  });

  test('GET /api/jobs/applications - Should list student applications', async () => {
    const res = await request(app)
      .get('/api/jobs/applications')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.applications.length).toBeGreaterThan(0);
    expect(res.body.applications[0].jobId._id.toString()).toBe(sampleJobId.toString());
  });
});
