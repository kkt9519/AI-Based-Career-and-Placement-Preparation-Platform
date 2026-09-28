const request = require('supertest');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// 1. Mock @google/generative-ai BEFORE importing app and aiService
const mockGenerateContent = jest.fn();
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: mockGenerateContent,
        }),
      };
    }),
  };
});

const app = require('../src/app');
const User = require('../src/models/User');
const Resume = require('../src/models/Resume');
const ResumeAnalysis = require('../src/models/ResumeAnalysis');
const { extractResumeText } = require('../src/utils/resumeParser');

const TEST_MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerpilot_ai_test';

let studentToken = '';
let studentId = '';
let secondStudentToken = '';
let secondStudentId = '';
let uploadedResumeId = '';
let uploadedFilePath = '';

const fixturePdfPath = path.resolve(__dirname, 'fixtures/sample_resume.pdf');
const dummyTxtPath = path.resolve(__dirname, 'fixtures/dummy_invalid.txt');

beforeAll(async () => {
  // Set test Gemini API key to trigger Gemini branch
  process.env.GEMINI_API_KEY = 'test_gemini_api_key_mock_123';

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_MONGO_URI);
  }

  // Create dummy invalid text file for fileFilter tests
  if (!fs.existsSync(dummyTxtPath)) {
    fs.writeFileSync(dummyTxtPath, 'This is a plain text file, not a PDF.');
  }

  // Clean and create primary student
  await User.deleteMany({ email: { $in: ['mockstudent1@careerpilot.ai', 'mockstudent2@careerpilot.ai'] } });
  
  const student1 = await User.create({
    name: 'Mock Student One',
    email: 'mockstudent1@careerpilot.ai',
    password: 'Password123!',
    role: 'student',
    targetRole: 'MERN Stack Developer',
    skills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB'],
  });
  studentId = student1._id;

  const loginRes1 = await request(app).post('/api/auth/login').send({
    email: 'mockstudent1@careerpilot.ai',
    password: 'Password123!',
  });
  studentToken = loginRes1.body.token;

  // Create second student to test cross-user access guards
  const student2 = await User.create({
    name: 'Mock Student Two',
    email: 'mockstudent2@careerpilot.ai',
    password: 'Password123!',
    role: 'student',
    targetRole: 'Java Developer',
  });
  secondStudentId = student2._id;

  const loginRes2 = await request(app).post('/api/auth/login').send({
    email: 'mockstudent2@careerpilot.ai',
    password: 'Password123!',
  });
  secondStudentToken = loginRes2.body.token;
});

afterAll(async () => {
  // Cleanup test database documents
  await ResumeAnalysis.deleteMany({ userId: { $in: [studentId, secondStudentId] } });
  await Resume.deleteMany({ userId: { $in: [studentId, secondStudentId] } });
  await User.deleteMany({ email: { $in: ['mockstudent1@careerpilot.ai', 'mockstudent2@careerpilot.ai'] } });

  // Cleanup temporary fixture file if created
  if (fs.existsSync(dummyTxtPath)) {
    fs.unlinkSync(dummyTxtPath);
  }

  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

describe('AI Resume Analyzer Isolated Test Suite', () => {
  describe('1. PDF Text Extraction & File Validation', () => {
    test('extractResumeText - Successfully extracts text from valid PDF buffer', async () => {
      expect(fs.existsSync(fixturePdfPath)).toBe(true);
      const text = await extractResumeText(fixturePdfPath, 'pdf');
      expect(typeof text).toBe('string');
      expect(text.length).toBeGreaterThan(50);
      // Verify control characters are stripped
      expect(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(text)).toBe(false);
    });

    test('extractResumeText - Throws helpful error on unsupported file type', async () => {
      await expect(extractResumeText(dummyTxtPath, 'txt')).rejects.toThrow('Unsupported file type');
    });

    test('POST /api/resumes/upload - Rejects invalid file format (non-PDF/DOCX) with 400', async () => {
      const res = await request(app)
        .post('/api/resumes/upload')
        .set('Authorization', `Bearer ${studentToken}`)
        .attach('resume', dummyTxtPath);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid file format/i);
    });

    test('POST /api/resumes/upload - Rejects upload when no file is attached with 400', async () => {
      const res = await request(app)
        .post('/api/resumes/upload')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/No resume file uploaded/i);
    });

    test('POST /api/resumes/upload - Accepts valid PDF, extracts text and stores file record', async () => {
      const res = await request(app)
        .post('/api/resumes/upload')
        .set('Authorization', `Bearer ${studentToken}`)
        .attach('resume', fixturePdfPath);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.resume).toBeDefined();
      expect(res.body.resume.fileType).toBe('pdf');
      expect(res.body.resume.textLength).toBeGreaterThan(50);
      expect(res.body.resume._id).toBeDefined();

      uploadedResumeId = res.body.resume._id;

      // Verify stored document in database
      const dbResume = await Resume.findById(uploadedResumeId);
      expect(dbResume).toBeDefined();
      expect(dbResume.userId.toString()).toBe(studentId.toString());
      expect(fs.existsSync(dbResume.storagePath)).toBe(true);
      uploadedFilePath = dbResume.storagePath;
    });
  });

  describe('2. Gemini AI Integration with Mocking (0 Paid API Calls)', () => {
    test('POST /api/resumes/:id/analyze - Successfully evaluates resume using mocked Gemini AI', async () => {
      // Mock Gemini AI structured response
      const mockAiResponse = {
        overallScore: 88,
        categoryScores: {
          impact: 85,
          completeness: 90,
          skills: 92,
          formatting: 86,
        },
        skillsIdentified: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript'],
        missingSkills: ['Docker', 'AWS'],
        strengths: [
          'Solid full stack MERN architectural foundation',
          'Clean REST API structuring with JWT authentication',
          'Good database modeling with Mongoose schemas',
        ],
        weaknesses: [
          'Add quantifiable performance benchmarks to projects',
          'Include cloud containerization experience (Docker/Kubernetes)',
        ],
        recommendations: [
          'Containerize backend services using Docker and docker-compose',
          'Quantify database query optimization results (e.g. 40% latency reduction)',
          'Add automated integration tests for campus viva demonstration',
        ],
        projectSuggestions: [
          'Containerized Microservices SaaS on AWS ECS',
          'High-throughput WebSocket real-time collaboration hub',
        ],
        roleFitSummary: 'Highly competitive candidate for MERN Stack Developer campus placement.',
        disclaimer: 'This AI-generated score is an educational preparation metric calibrated to identify learning gaps and should not be used as an objective employer hiring decision.',
      };

      mockGenerateContent.mockResolvedValueOnce({
        response: {
          text: () => `\`\`\`json\n${JSON.stringify(mockAiResponse)}\n\`\`\``,
        },
      });

      const res = await request(app)
        .post(`/api/resumes/${uploadedResumeId}/analyze`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ targetRole: 'MERN Stack Developer' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.analysis).toBeDefined();
      expect(res.body.analysis.overallScore).toBe(88);
      expect(res.body.analysis.categoryScores.skills).toBe(92);
      expect(res.body.analysis.skillsIdentified).toContain('React');
      expect(res.body.analysis.missingSkills).toContain('Docker');
      expect(res.body.analysis.disclaimer).toMatch(/educational preparation metric/i);

      // Verify mock was called without reaching external Google servers
      expect(mockGenerateContent).toHaveBeenCalled();

      // Verify saved in MongoDB
      const saved = await ResumeAnalysis.findById(res.body.analysis._id);
      expect(saved).not.toBeNull();
      expect(saved.overallScore).toBe(88);
      expect(saved.disclaimer).toBeDefined();
    });

    test('POST /api/resumes/:id/analyze - Seamlessly falls back to heuristic engine if Gemini fails', async () => {
      // Force Gemini mock to throw an API quota or timeout error
      mockGenerateContent.mockRejectedValueOnce(new Error('Google Generative AI Quota Exceeded (429)'));

      const res = await request(app)
        .post(`/api/resumes/${uploadedResumeId}/analyze`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ targetRole: 'MERN Stack Developer' });

      // Controller should NOT fail with 500; it must return 201 via the fallback engine
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.analysis).toBeDefined();
      expect(res.body.analysis.overallScore).toBeGreaterThanOrEqual(40);
      expect(res.body.analysis.disclaimer).toMatch(/educational preparation metric/i);
    });
  });

  describe('3. Error Handling, Access Security & Edge Cases', () => {
    test('POST /api/resumes/:id/analyze - Returns 401 Unauthorized if token missing', async () => {
      const res = await request(app)
        .post(`/api/resumes/${uploadedResumeId}/analyze`)
        .send({ targetRole: 'MERN Stack Developer' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('POST /api/resumes/:id/analyze - Returns 404 Not Found for non-existent resume ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post(`/api/resumes/${nonExistentId}/analyze`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ targetRole: 'MERN Stack Developer' });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    test('POST /api/resumes/:id/analyze - Returns 403 Forbidden when accessing another user\'s resume', async () => {
      const res = await request(app)
        .post(`/api/resumes/${uploadedResumeId}/analyze`)
        .set('Authorization', `Bearer ${secondStudentToken}`)
        .send({ targetRole: 'Java Developer' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Forbidden/i);
    });

    test('GET /api/resumes/analyses/history - Retrieves student analysis records', async () => {
      const res = await request(app)
        .get('/api/resumes/analyses/history')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.analyses.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('4. Disk Cleanup & Safe Deletion', () => {
    test('DELETE /api/resumes/:id - Deletes resume document and unlinks physical file from disk', async () => {
      expect(fs.existsSync(uploadedFilePath)).toBe(true);

      const res = await request(app)
        .delete(`/api/resumes/${uploadedResumeId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify physical file unlinked from disk
      expect(fs.existsSync(uploadedFilePath)).toBe(false);

      // Verify MongoDB record deleted
      const checkDoc = await Resume.findById(uploadedResumeId);
      expect(checkDoc).toBeNull();

      // Verify associated analyses are cascade deleted
      const checkAnalyses = await ResumeAnalysis.find({ resumeId: uploadedResumeId });
      expect(checkAnalyses.length).toBe(0);
    });
  });
});
