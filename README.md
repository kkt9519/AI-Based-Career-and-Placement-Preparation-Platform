# 🎓 CareerPilot AI – AI-Based Career and Placement Preparation Platform

> **A production-grade, full-stack MERN platform designed for B.Tech Computer Science & Design Capstone Projects, Summer Training Evaluation, and Campus Placement Preparation.**

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-brightgreen.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Jest Tests](https://img.shields.io/badge/Tests-51%20Passed%20(84.4%25%20Coverage)-success.svg)](https://jestjs.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 Overview & Key Features

**CareerPilot AI** bridges the gap between academic degree curricula and industry engineering hiring expectations. It replaces static mock tests and generic job boards with an AI-augmented preparation lifecycle:

1. **🔐 Secure Authentication & RBAC**:
   - JWT stateless tokens, bcrypt password hashing (10 salt rounds), Zod input validation, and role-based guards (`student` vs. `admin`).
   - One-click demo login buttons on the login page for instant examiner demonstrations.

2. **📊 Dynamic Student Profile & Placement Readiness Index**:
   - Interactive profile gauge (0-100%) tracking personal, academic, and portfolio links.
   - Dynamic **Placement Readiness Index** aggregating resume ATS scores, profile completeness, interview performance, and aptitude quiz results.

3. **📄 Resume Ingestion & AI ATS Analyzer**:
   - Upload `.pdf` and `.docx` resumes with server-side text extraction (`pdf-parse` & `mammoth`).
   - Real-time ATS compatibility scoring broken into 4 categories: Formatting, Keywords, Experience, and Skills.
   - Interactive **Skill Gap Matrix** comparing candidate skills against industry role standards, with actionable viva recommendations and project ideas.

4. **🗺️ Interactive Career Roadmaps**:
   - Milestone-driven learning paths for MERN Stack, Java, Full Stack, and Frontend engineers.
   - Checkbox progress tracking with real-time percentage completion calculation.

5. **💼 Placement & Internship Portal**:
   - Curated placement job opportunities with transparent compatibility match %:
     $$\text{Match \%} = (75\% \times \text{Required Match}) + (25\% \times \text{Preferred Match})$$
   - Bookmarking shortlist and one-click application submission with personal notes.

6. **🤖 AI Mock Interview Studio**:
   - Practice Technical and HR rounds with a live timer clock.
   - Instant AI evaluation across **5 criteria**: Relevance, Technical Accuracy, Clarity, Completeness, and Communication.
   - Recommended viva phrasing tips and key concepts for revision.

7. **🧠 Aptitude & Coding Practice Suite**:
   - Timed assessments across Quantitative Aptitude, Logical Reasoning, Verbal Ability, CS Core Subjects, and Coding Challenges.
   - Question palette with Answered, Flagged, and Unvisited states.
   - Instant score reports with in-depth technical explanations for viva learning.

8. **🛡️ Administrator Management Console**:
   - Platform KPI summary cards (Total Students, Resumes, Interviews, Active Jobs).
   - Candidate directory with one-click account activation / suspension toggles.
   - Full CRUD management for placement jobs and question banks.

---

## 🏗️ Architecture & Monorepo Structure

```
careerpilot-ai/
├── backend/                         # Node.js + Express REST API
│   ├── src/
│   │   ├── controllers/             # auth, user, resume, career, job, interview, assessment, admin
│   │   ├── middleware/              # auth (protect, requireRole), errorHandler, upload (Multer)
│   │   ├── models/                  # User, Resume, ResumeAnalysis, CareerRoadmap, Job,
│   │   │                            # SavedJob, JobApplication, InterviewSession, Question, Assessment
│   │   ├── routes/                  # Modular route definitions
│   │   ├── services/                # aiService (Gemini 1.5 Flash + Semantic Heuristic Fallback)
│   │   ├── utils/                   # resumeParser, token
│   │   ├── validators/              # Zod input schemas
│   │   ├── scripts/                 # seed.js, seedQuestions.js
│   │   ├── app.js                   # Express application setup & middleware
│   │   └── server.js                # HTTP server initialization
│   ├── tests/                       # 7 Jest test suites (51 automated tests, 84.4% line coverage)
│   └── uploads/                     # Local resume storage directory
│
├── frontend/                        # React 18 + Vite + Tailwind CSS Single Page App
│   ├── src/
│   │   ├── components/              # Navbar, Sidebar, Footer, ProtectedRoute, AdminRoute, ResumeUploadCard
│   │   ├── context/                 # AuthContext (state & tokens), ThemeContext (dark/light)
│   │   ├── pages/                   # LandingPage, LoginPage, RegisterPage, DashboardPage,
│   │   │                            # ProfilePage, ResumeAnalyzerPage, CareerRoadmapPage,
│   │   │                            # JobsPage, MockInterviewPage, AssessmentsPage, AdminDashboardPage
│   │   ├── services/                # api.js (Axios client with interceptors)
│   │   ├── App.jsx                  # Main routing configuration
│   │   └── main.jsx                 # React root mount
│   └── tailwind.config.js           # Theme and styling configuration
│
└── docs/                            # Capstone Academic Documentation
    ├── PROJECT_REPORT.md            # Comprehensive B.Tech Capstone Project Report (SRS, Architecture)
    ├── DATABASE_SCHEMA.md           # Mongoose schemas, relationships, and indexing strategies
    ├── API_DOCUMENTATION.md         # Exhaustive REST API reference catalog (30+ endpoints)
    └── VIVA_PREPARATION.md          # 25+ viva questions & answers with 10-minute demo script
```

---

## ⚡ Quick Start Guide

### Prerequisites
* **Node.js** (v18 or higher)
* **MongoDB** (running locally on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)
* **npm** or **yarn**

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-org/careerpilot-ai.git
cd careerpilot-ai

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/careerpilot_ai
JWT_SECRET=super_secret_careerpilot_jwt_key_2026_dev
JWT_EXPIRES_IN=7d
COOKIE_EXPIRES_DAYS=7
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE_MB=5

# Google Gemini API Key for AI Resume Analysis & ATS Evaluation
# Get your free key at: https://aistudio.google.com/
# (If omitted, the platform seamlessly uses the built-in deterministic heuristic fallback)
GEMINI_API_KEY=your_gemini_api_key_here
```

> 🔒 **Security Notice:** The `GEMINI_API_KEY` and `JWT_SECRET` are loaded strictly on the Node.js backend (`process.env`). They are never bundled into client-side code, exposed to the browser, or committed to version control (`.gitignore` protects all `.env` files).

---

## 🔐 Secure User Authentication Architecture

CareerPilot AI implements enterprise-grade authentication:
1. **HttpOnly & SameSite Cookies**: Authentication tokens (`token`) are delivered in `HttpOnly`, `SameSite: Lax` (or `None` in production HTTPS) cookies with path `/`. JavaScript running in the browser cannot access the token, preventing Cross-Site Scripting (XSS) token exfiltration.
2. **Zero Long-Lived Storage in localStorage**: Tokens are never persisted in browser `localStorage`. On application boot, the React client verifies the session via `authAPI.getMe()` using the automatic cookie handshake.
3. **Dual Token Retrieval on Backend**: Middleware checks `req.cookies.token` first for browser sessions, with seamless fallback to `Authorization: Bearer <token>` headers for automated tests, Postman, and CLI tools.
4. **Bcrypt Password Hashing**: Passwords are hashed with `bcryptjs` using 10 salt rounds in Mongoose `pre('save')` hooks. Passwords are never stored in plain text and are excluded by default (`select: false`).
5. **Privilege Escalation Defense**: Public registration (`POST /api/auth/register`) enforces `role: 'student'`. Users cannot grant themselves administrator privileges. Admin accounts can only be provisioned via database seed scripts or by authorized administrators.
6. **Rate Limiting**: Dedicated rate limiting on `/api/auth/login` and `/api/auth/register` (25 requests per 15 minutes) prevents credential brute-forcing and email enumeration attacks.
7. **Cross-Origin Resource Sharing (CORS)**: Configured with `credentials: true` and origin validation for local development and deployed frontend URLs.
8. **Session Termination**: `POST /api/auth/logout` explicitly clears the `token` cookie with an expired timestamp (`Expires: 1970-01-01`).

---

## 🤖 AI Resume Analyzer Feature Overview

The **AI Resume Analyzer** provides institutional-grade evaluation tailored for campus placement preparation:
1. **Multi-Format Upload**: Accepts `.pdf` and `.docx` files up to 5MB, managed by Multer with disk cleanup on deletion or corruption.
2. **Text Extraction Engine**: Uses `pdf-parse` and `mammoth` with regex sanitization to remove ASCII control characters and normalize multi-line whitespace.
3. **Google Gemini Generative AI SDK**: Calls `gemini-1.5-flash` using `@google/generative-ai` to parse candidate competencies against targeted placement roles (`MERN Stack Developer`, `Java Developer`, `Full Stack Developer`, etc.).
4. **Structured JSON Output Schema**:
   * `overallScore`: Integer (0–100) calibrated against campus recruiter rubrics.
   * `categoryScores`: Breakdown across Technical Skills, Completeness, Impact/Metrics, and ATS Formatting.
   * `skillsIdentified`: Explicit keywords extracted from the document.
   * `missingSkills`: High-priority target role requirements missing from the resume.
   * `strengths` & `weaknesses`: Point-by-point profile critiques.
   * `recommendations`: Actionable steps to improve ATS pass rates.
   * `projectSuggestions`: Capstone project ideas designed to bridge detected skill gaps.
   * `roleFitSummary`: Executive recruiter assessment.
   * `disclaimer`: Explicit statement that the score is an educational preparation metric, not an employer hiring decision.
5. **Deterministic Heuristic Fallback Engine**: Guarantees zero downtime if internet connectivity is interrupted or if Gemini API quotas are exhausted.
6. **Student UI**: Real-time circular SVG score gauge, category progress bars, matched/missing skill chips, previous analysis history, and one-click retry on failure.

---

### 3. Seed Database with Realistic Data
Populate the database with sample administrators, student candidates, campus placement jobs, and categorized question banks:
```bash
cd backend
node src/scripts/seed.js
```

### 4. Run the Application
Open two terminal windows:

**Terminal 1 (Backend API):**
```bash
cd backend
node src/server.js
# API running at http://localhost:5000
# Health check: http://localhost:5000/api/health
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
# Frontend accessible at http://localhost:5173
```

---

## 🔑 Default Demo Credentials

For examiner reviews and live project defense:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Student** | `student@careerpilot.ai` | `StudentPassword123!` | Resume ATS, Mock Interviews, Aptitude Tests, Roadmaps, Job Applications |
| **Admin** | `admin@careerpilot.ai` | `AdminPassword123!` | Platform Analytics, Candidate Governance, Job & Question CRUD |

*(The login page also provides 1-click quick-fill buttons for both roles).*

---

## 🧪 Automated Testing & Code Quality

### Run Authentication & Authorization Test Suite:
```bash
cd backend
npx jest tests/auth.test.js --runInBand
```

### Run Isolated AI Resume Analyzer Test Suite (Mocked Gemini SDK - 0 Paid API Calls):
```bash
cd backend
npx jest tests/resume_analyzer_isolated.test.js --runInBand
```

### Run All Test Suites:
```bash
cd backend
npm test
```

### Run With Code Coverage:
```bash
cd backend
npm run test:coverage
```

**Latest Test Results:**
* **Test Suites**: 8 passed, 8 total
* **Tests**: 70 passed, 70 total
* **Mock Isolation**: 100% mocked Google Generative AI in automated tests (zero paid API calls, fast deterministic CI/CD execution).

---

## 📚 Academic Documentation & Viva Defense
Detailed project documentation is available in the `docs/` folder:
* **[Comprehensive Project Report](docs/PROJECT_REPORT.md)**: Executive summary, problem statement, SRS, and architecture.
* **[Database Schema Reference](docs/DATABASE_SCHEMA.md)**: Mongoose schemas, constraints, indexes, and ER diagrams.
* **[API Reference Catalog](docs/API_DOCUMENTATION.md)**: Complete REST API catalog with request/response schemas.
* **[Viva Preparation & Defense Guide](docs/VIVA_PREPARATION.md)**: 25+ in-depth technical questions with answers and a 10-minute examiner presentation script.

---

## 👥 Authors
* **Final-Year B.Tech Computer Science & Design Project Team**
* **Project Title**: CareerPilot AI – AI-Based Career and Placement Preparation Platform
* **Academic Year**: 2025–2026
