import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_presentation(output_path):
    prs = Presentation()
    # Set slide dimensions to 16:9 widescreen
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Color Palette
    PRIMARY = RGBColor(30, 27, 75)      # Deep Navy/Indigo
    BRAND = RGBColor(37, 99, 235)       # Brand Blue
    ACCENT = RGBColor(16, 185, 129)     # Emerald Green
    DARK = RGBColor(15, 23, 42)         # Slate 900
    MUTED = RGBColor(100, 116, 139)     # Slate 500
    LIGHT_BG = RGBColor(248, 250, 252)  # Slate 50
    CARD_BG = RGBColor(241, 245, 249)   # Slate 100
    WHITE = RGBColor(255, 255, 255)
    BORDER_CLR = RGBColor(226, 232, 240)

    blank_layout = prs.slide_layouts[6]

    def add_header(slide, title, category="FINAL YEAR CAPSTONE PROJECT"):
        # Category Badge
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = BRAND

        # Title
        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.8))
        tf = t_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(26)
        p.font.bold = True
        p.font.color.rgb = PRIMARY

    def add_card(slide, left, top, width, height, title, items, badge=None, bg_color=CARD_BG, title_color=BRAND):
        # Card shape background
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        shape.line.color.rgb = BORDER_CLR
        shape.line.width = Pt(1)

        # Content text
        txBox = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.2), width - Inches(0.4), height - Inches(0.4))
        tf = txBox.text_frame
        tf.word_wrap = True

        p0 = tf.paragraphs[0]
        if badge:
            p0.text = f"[{badge}] {title}"
        else:
            p0.text = title
        p0.font.size = Pt(16)
        p0.font.bold = True
        p0.font.color.rgb = title_color
        p0.space_after = Pt(10)

        for item in items:
            p = tf.add_paragraph()
            p.text = f"•  {item}"
            p.font.size = Pt(12)
            p.font.color.rgb = DARK
            p.space_after = Pt(6)

    # ==================== SLIDE 1: TITLE SLIDE ====================
    slide1 = prs.slides.add_slide(blank_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = PRIMARY
    bg1.line.fill.background()

    # Title Banner Box
    title_box = slide1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(11.0), Inches(3.5))
    tf1 = title_box.text_frame
    tf1.word_wrap = True

    p_badge = tf1.paragraphs[0]
    p_badge.text = "FINAL YEAR B.TECH CAPSTONE PROJECT PRESENTATION"
    p_badge.font.size = Pt(13)
    p_badge.font.bold = True
    p_badge.font.color.rgb = ACCENT
    p_badge.space_after = Pt(14)

    p_title = tf1.add_paragraph()
    p_title.text = "CareerPilot AI"
    p_title.font.size = Pt(48)
    p_title.font.bold = True
    p_title.font.color.rgb = WHITE
    p_title.space_after = Pt(8)

    p_sub = tf1.add_paragraph()
    p_sub.text = "AI-Based Career and Placement Preparation Platform"
    p_sub.font.size = Pt(22)
    p_sub.font.color.rgb = RGBColor(219, 234, 254)
    p_sub.space_after = Pt(20)

    p_desc = tf1.add_paragraph()
    p_desc.text = "Bridging academic curricula and industry hiring standards through Google Gemini AI, ATS scoring, interactive mock interviews, and personalized career roadmaps."
    p_desc.font.size = Pt(14)
    p_desc.font.color.rgb = RGBColor(203, 213, 225)

    # Presenter Card bottom
    card_pres = slide1.shapes.add_textbox(Inches(1.2), Inches(5.6), Inches(11.0), Inches(1.2))
    tf_p = card_pres.text_frame
    p_foot = tf_p.paragraphs[0]
    p_foot.text = "Department of Computer Science & Design  |  Academic Year: 2025–2026\nTech Stack: React 18, Node.js, Express, MongoDB, Google Gemini AI, Tailwind CSS"
    p_foot.font.size = Pt(13)
    p_foot.font.color.rgb = RGBColor(148, 163, 184)

    # ==================== SLIDE 2: PROBLEM STATEMENT ====================
    slide2 = prs.slides.add_slide(blank_layout)
    add_header(slide2, "Problem Statement & Industry Context", "Background & Motivation")
    
    add_card(slide2, Inches(0.8), Inches(1.8), Inches(3.6), Inches(4.8), 
             "1. Resume Filtering Dilemma", 
             [
                 "Over 75% of resumes are filtered out by automated Applicant Tracking Systems (ATS) before human review.",
                 "Students lack objective feedback on missing technical keywords and formatting errors.",
                 "Generic word templates fail to highlight project impact with measurable outcomes."
             ], "THE ATS GAP", title_color=RGBColor(225, 29, 72))

    add_card(slide2, Inches(4.8), Inches(1.8), Inches(3.6), Inches(4.8), 
             "2. Interview Anxiety & Gaps", 
             [
                 "Students experience significant anxiety during technical and HR placement rounds.",
                 "Limited access to experienced technical interviewers for practice and viva feedback.",
                 "Evaluation is subjective without standardized scoring across communication and technical accuracy."
             ], "MOCK INTERVIEW VOID", title_color=RGBColor(217, 119, 6))

    add_card(slide2, Inches(8.8), Inches(1.8), Inches(3.6), Inches(4.8), 
             "3. Fragmented Preparation", 
             [
                 "Students juggle disconnected resources: LeetCode for DSA, YouTube for roadmaps, job portals for listings.",
                 "No unified metric measuring overall 'Placement Readiness Index' (0-100%).",
                 "Colleges lack centralized visibility into student readiness and skill gaps."
             ], "FRAGMENTED TOOLS", title_color=BRAND)

    # ==================== SLIDE 3: PROPOSED SOLUTION & OBJECTIVES ====================
    slide3 = prs.slides.add_slide(blank_layout)
    add_header(slide3, "Proposed Solution & Project Objectives", "System Vision")

    add_card(slide3, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "Key Project Objectives",
             [
                 "Develop an AI-powered ATS Resume Analyzer that scores resumes out of 100 with category breakdowns (Impact, Completeness, Skills, Formatting).",
                 "Build an AI Mock Interview Studio with timed technical and HR rounds, evaluating answers on 5 institutional criteria.",
                 "Implement an Aptitude & Coding Practice Suite with timed tests, answer evaluation, and technical viva explanations.",
                 "Provide Dynamic Career Roadmaps and Placement Portal with transparent match calculation: 75% Required + 25% Preferred.",
                 "Deliver an Administrator Governance Console for candidate metrics, job listings, and question bank management."
             ], "OBJECTIVES", title_color=BRAND)

    add_card(slide3, Inches(6.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "The CareerPilot AI Innovation",
             [
                 "Dual-Engine Intelligence: Combines Google Gemini 1.5 Flash with a Deterministic Semantic Fallback Engine for 100% reliability.",
                 "Real-Time Readiness Index: Aggregates profile completeness, resume score, interview performance, and assessment results dynamically.",
                 "Skill Gap Matrix: Contrasts student competencies against real target job roles (MERN, Java, Full Stack).",
                 "Enterprise Security: Full HttpOnly SameSite cookie authentication, bcrypt hashing, and strict role guards.",
                 "Zero External Mocking in Tests: 70 automated tests validating all endpoints without paid API dependencies."
             ], "INNOVATION", title_color=ACCENT)

    # ==================== SLIDE 4: SYSTEM ARCHITECTURE ====================
    slide4 = prs.slides.add_slide(blank_layout)
    add_header(slide4, "Full-Stack System Architecture", "Monorepo Engineering")

    add_card(slide4, Inches(0.8), Inches(1.8), Inches(3.6), Inches(4.8),
             "Frontend Client (Vite + React)",
             [
                 "React 18 Single Page Application with Tailwind CSS 3.4.",
                 "Axios instance with withCredentials: true for seamless cookie handling.",
                 "Global state via React Context (AuthContext & ThemeContext).",
                 "Interactive circular SVG score gauges, category progress bars, and timed quiz interfaces.",
                 "Client-side routing protected by ProtectedRoute and AdminRoute."
             ], "PRESENTATION LAYER", title_color=BRAND)

    add_card(slide4, Inches(4.8), Inches(1.8), Inches(3.6), Inches(4.8),
             "Backend Services (Node.js & Express)",
             [
                 "RESTful modular architecture (Controllers, Middleware, Routes, Validators, Services).",
                 "HttpOnly cookie token retrieval with Bearer token fallback for testing.",
                 "Multer file streaming with pdf-parse and mammoth for clean text extraction.",
                 "Rate limiting (authLimiter) to mitigate brute-force attacks.",
                 "Centralized error handling with Zod validation schemas."
             ], "APPLICATION LAYER", title_color=PRIMARY)

    add_card(slide4, Inches(8.8), Inches(1.8), Inches(3.6), Inches(4.8),
             "Database & AI Layer",
             [
                 "MongoDB with Mongoose ODM modeling 10 distinct entities.",
                 "Bcrypt password hashing (10 salt rounds) in pre-save hooks.",
                 "Google Gemini 1.5 Flash via @google/generative-ai official SDK.",
                 "Heuristic Semantic Engine ensuring zero downtime viva defense.",
                 "Local disk storage for uploaded resumes with cleanup on deletion."
             ], "DATA & AI LAYER", title_color=ACCENT)

    # ==================== SLIDE 5: AI RESUME ANALYZER ====================
    slide5 = prs.slides.add_slide(blank_layout)
    add_header(slide5, "Module 1: AI Resume Analyzer & ATS Scorer", "Core Technical Feature")

    add_card(slide5, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "Ingestion & Parsing Pipeline",
             [
                 "Multi-Format Upload: Supports .pdf and .docx documents up to 5MB.",
                 "Text Sanitization: pdf-parse strips non-printable ASCII control characters and normalizes whitespace.",
                 "Role Calibration: Evaluates text against target placement roles: MERN Stack, Java Developer, Full Stack, Frontend, etc.",
                 "Dual-Engine Execution: Sends structured prompt to Gemini 1.5 Flash; automatically falls back to deterministic heuristic engine if offline.",
                 "Disk Cleanup: Corrupt files and deleted resumes are immediately unlinked from storage."
             ], "PIPELINE", title_color=BRAND)

    add_card(slide5, Inches(6.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "Structured Output & Reporting",
             [
                 "Overall Score: Recruiter-calibrated score out of 100.",
                 "Category Scores: Technical Skills, Completeness, Impact/Metrics, and ATS Formatting.",
                 "Skill Gap Matrix: Visual chips of identified keywords vs. missing competencies.",
                 "Actionable Feedback: 3-5 profile strengths, weaknesses, and concrete recommendations.",
                 "Capstone Project Ideas: Recommends project ideas to bridge detected missing skills.",
                 "Academic Disclaimer: Explicitly notes the score is an educational preparation metric, not an employer hiring decision."
             ], "ANALYTICS", title_color=ACCENT)

    # ==================== SLIDE 6: AI MOCK INTERVIEW STUDIO ====================
    slide6 = prs.slides.add_slide(blank_layout)
    add_header(slide6, "Module 2: AI Mock Interview Studio", "Interactive Simulation")

    add_card(slide6, Inches(0.8), Inches(1.8), Inches(3.6), Inches(4.8),
             "Interview Modes",
             [
                 "Technical Track: Role-specific questions covering JavaScript, React, Node.js, Spring Boot, SQL, and DSA.",
                 "HR / Behavioral Track: Situational questions based on teamwork, conflict resolution, leadership, and STAR methodology.",
                 "Live Countdown Timer: Replicates authentic placement test pressure.",
                 "Question Progression: Sequential question answering with state preservation."
             ], "EXPERIENCE", title_color=BRAND)

    add_card(slide6, Inches(4.8), Inches(1.8), Inches(3.6), Inches(4.8),
             "5-Criteria AI Evaluation",
             [
                 "1. Relevance (20 pts): Does answer address the specific question?",
                 "2. Technical Accuracy (20 pts): Are technical terms and concepts correct?",
                 "3. Clarity & Structure (20 pts): Is the explanation coherent?",
                 "4. Completeness (20 pts): Are edge cases and examples mentioned?",
                 "5. Communication (20 pts): Is phrasing professional and articulate?"
             ], "RUBRIC", title_color=RGBColor(217, 119, 6))

    add_card(slide6, Inches(8.8), Inches(1.8), Inches(3.6), Inches(4.8),
             "Actionable Feedback",
             [
                 "Instant AI Critiques: Question-by-question scoring and strengths.",
                 "Viva Phrasing Tips: Recommends improved answers for campus placement interviews.",
                 "Performance Report: Overall score out of 100 with category badges.",
                 "Interview History: Comprehensive session logs preserved in MongoDB."
             ], "VIVA PREP", title_color=ACCENT)

    # ==================== SLIDE 7: APTITUDE & CODING PRACTICE ====================
    slide7 = prs.slides.add_slide(blank_layout)
    add_header(slide7, "Module 3: Aptitude & Coding Practice Suite", "Placement Test Preparation")

    add_card(slide7, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "5 Assessment Categories",
             [
                 "Quantitative Aptitude: Time & Work, Speed & Distance, Profit & Loss, Percentages, and Probability.",
                 "Logical Reasoning: Syllogisms, Coding-Decoding, Blood Relations, and Number Series.",
                 "Verbal Ability: Sentence Correction, Reading Comprehension, and Technical Vocabulary.",
                 "Core Computer Science: Data Structures, Operating Systems (Threads, Deadlocks), DBMS (SQL, Normalization), and Networks.",
                 "Coding Challenges: LeetCode-style algorithmic questions with constraints and complexity requirements."
             ], "CONTENT DOMAINS", title_color=BRAND)

    add_card(slide7, Inches(6.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "Testing Room & Analytics",
             [
                 "Interactive Palette: Tracks Answered, Flagged for Review, and Unvisited questions in real time.",
                 "Timed Session Engine: Automatic test submission when countdown timer reaches zero.",
                 "Deep Technical Explanations: Every question provides step-by-step mathematical or code solutions for viva review.",
                 "Historical Analytics: Category-wise accuracy breakdown (Quant vs. Core CS vs. Coding).",
                 "Sanitized Delivery: Correct answers are never sent to client during the active test session."
             ], "TEST ENGINE", title_color=ACCENT)

    # ==================== SLIDE 8: ROADMAPS & PLACEMENT PORTAL ====================
    slide8 = prs.slides.add_slide(blank_layout)
    add_header(slide8, "Module 4: Career Roadmaps & Placement Portal", "Career Progression")

    add_card(slide8, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "Personalized Career Roadmaps",
             [
                 "Target Role Alignment: Curated learning paths for MERN Stack, Java Developer, Full Stack, and Frontend Engineer.",
                 "Milestone Tracking: Step-by-step progress tracking with real-time percentage completion calculation.",
                 "Curated Learning Resources: Links to high-quality documentation, full-stack open curricula, and DSA sheets.",
                 "Capstone Recommendations: Guided project suggestions designed to bridge identified resume gaps."
             ], "LEARNING PATHS", title_color=BRAND)

    add_card(slide8, Inches(6.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "Placement & Internship Portal",
             [
                 "Transparent Compatibility Formula:\nMatch % = (75% × Required Match) + (25% × Preferred Match).",
                 "Job Exploration: Filter placement opportunities by work mode (Remote, Hybrid, Onsite) and job type.",
                 "Shortlisting: Bookmark jobs for quick access.",
                 "1-Click Application: Submit applications with personal notes, tracked across Applied, Review, and Shortlisted statuses."
             ], "PLACEMENTS", title_color=ACCENT)

    # ==================== SLIDE 9: ADMIN CONSOLE & GOVERNANCE ====================
    slide9 = prs.slides.add_slide(blank_layout)
    add_header(slide9, "Module 5: Admin Governance Console", "Institutional Management")

    add_card(slide9, Inches(0.8), Inches(1.8), Inches(3.6), Inches(4.8),
             "Platform Analytics",
             [
                 "Real-time KPI metrics aggregated from MongoDB collections.",
                 "Total Students registered across departments.",
                 "Total Resumes parsed and ATS scores computed.",
                 "Mock Interviews completed and average score metrics.",
                 "Active Job Postings and total applications submitted."
             ], "KPIS", title_color=BRAND)

    add_card(slide9, Inches(4.8), Inches(1.8), Inches(3.6), Inches(4.8),
             "Candidate Governance",
             [
                 "Paginated student directory with search by name, email, and target role.",
                 "1-Click Account Status Toggle: Activate or Suspend candidates instantly.",
                 "Profile inspection: View candidate placement readiness index and resume scores.",
                 "RBAC Security: Admin dashboard is inaccessible to student accounts (403 Forbidden)."
             ], "USERS", title_color=PRIMARY)

    add_card(slide9, Inches(8.8), Inches(1.8), Inches(3.6), Inches(4.8),
             "Job & Question CRUD",
             [
                 "Job Management: Create, edit, and delete campus job postings.",
                 "Question Bank Management: Add, update, and remove questions with answer keys and explanations.",
                 "Category Tagging: Map questions to Aptitude, Core CS, or Coding rounds."
             ], "CRUD ENGINE", title_color=ACCENT)

    # ==================== SLIDE 10: SECURITY ARCHITECTURE ====================
    slide10 = prs.slides.add_slide(blank_layout)
    add_header(slide10, "Enterprise Security & Authentication Architecture", "Security & RBAC")

    add_card(slide10, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "HttpOnly Cookie Authentication",
             [
                 "Zero Long-Lived Storage in localStorage: JWT is stored strictly in HttpOnly, SameSite, Secure cookies.",
                 "XSS Mitigation: Malicious client scripts cannot read or exfiltrate the authentication token.",
                 "Dual Token Acceptance: Middleware inspects req.cookies.token first, falling back to Authorization header for API tools and automated tests.",
                 "Session Termination: Logout endpoint explicitly clears cookie with Expired timestamp.",
                 "CORS with Credentials: Configured with credentials: true and dynamic origin validation."
             ], "COOKIE SESSIONS", title_color=BRAND)

    add_card(slide10, Inches(6.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "Password & Privilege Defense",
             [
                 "Bcrypt Hashing: Passwords hashed with 10 salt rounds in pre-save hooks; plain text never stored.",
                 "select: false: Password field is excluded from queries by default.",
                 "Privilege Defense: Public registration strictly forces role: 'student'. Users cannot self-assign admin status.",
                 "Rate Limiting: authLimiter restricts login/registration to 25 requests per 15 minutes to block brute-force attacks.",
                 "Safe Error Messages: Generic 'Invalid email or password' message prevents user enumeration."
             ], "HARDENING", title_color=ACCENT)

    # ==================== SLIDE 11: DATABASE DESIGN & MODELS ====================
    slide11 = prs.slides.add_slide(blank_layout)
    add_header(slide11, "Database Schema & Entity-Relationship Design", "MongoDB Architecture")

    add_card(slide11, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "Core User & Evaluation Models",
             [
                 "User: Credentials, profile (CGPA, degree, links), target role, skills, account status.",
                 "Resume: User reference, file metadata, physical storage path, cleaned extracted text.",
                 "ResumeAnalysis: Overall score, 4 category scores, identified/missing skills, recommendations, disclaimer.",
                 "InterviewSession: Track (Tech/HR), target role, questions, answers, 5-criteria scores, feedback.",
                 "CareerRoadmap: Personalized milestones, checklist items, and completion percentages."
             ], "ENTITIES 1-5", title_color=BRAND)

    add_card(slide11, Inches(6.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "Placement & Testing Models",
             [
                 "Job: Title, company, location, type, required & preferred skills, salary, deadline.",
                 "SavedJob: Candidate bookmark references.",
                 "JobApplication: Candidate application notes and status tracking (applied, review, shortlisted).",
                 "Question: Category, difficulty, question text, options, correct answer, viva explanation.",
                 "Assessment: Timed session records, answers submitted, score breakdown, and time spent."
             ], "ENTITIES 6-10", title_color=ACCENT)

    # ==================== SLIDE 12: TESTING & VERIFICATION ====================
    slide12 = prs.slides.add_slide(blank_layout)
    add_header(slide12, "Testing, Verification & Quality Assurance", "Robustness & CI/CD")

    add_card(slide12, Inches(0.8), Inches(1.8), Inches(3.6), Inches(4.8),
             "Automated Test Suites",
             [
                 "8 Test Suites: 100% Passed (70/70 tests).",
                 "auth.test.js: 15 tests covering registration, cookies, password hashing, and logout.",
                 "resume_analyzer_isolated.test.js: 12 tests with mocked Gemini AI.",
                 "admin.test.js: 9 tests for RBAC, user management, and job CRUD.",
                 "jobs.test.js: 7 tests for matching formula and applications."
             ], "100% PASS RATE", title_color=ACCENT)

    add_card(slide12, Inches(4.8), Inches(1.8), Inches(3.6), Inches(4.8),
             "Isolation & Zero Cost",
             [
                 "Mocked Gemini SDK: Uses jest.mock('@google/generative-ai') to guarantee 0 paid API calls during automated CI/CD.",
                 "Fallback Verification: Automated tests prove system falls back seamlessly if AI quota is exhausted.",
                 "Security Verification: Tests prove unauthenticated requests to /api/users/dashboard receive 401.",
                 "Input Validation: Zod schemas tested with invalid emails and short passwords."
             ], "MOCK ISOLATION", title_color=BRAND)

    add_card(slide12, Inches(8.8), Inches(1.8), Inches(3.6), Inches(4.8),
             "Build & Deployment",
             [
                 "Frontend Vite Build: npm run build successfully compiles without errors.",
                 "Single Page App Routing: vercel.json rewrites all client routes to /index.html.",
                 "Render Blueprint: render.yaml automates backend deployment.",
                 "Git Integrity: Clean commits on main branch at github.com/kkt9519."
             ], "DEPLOY READY", title_color=PRIMARY)

    # ==================== SLIDE 13: LIVE DEMO HIGHLIGHTS ====================
    slide13 = prs.slides.add_slide(blank_layout)
    add_header(slide13, "Live Demonstration Walkthrough (5-Minute Viva Plan)", "Demonstration Script")

    add_card(slide13, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "Demo Credentials & Navigation",
             [
                 "Step 1: Open http://localhost:5173 on browser.",
                 "Step 2: 1-Click Demo Login as Student (student@careerpilot.ai / StudentPassword123!).",
                 "Step 3: Show Dynamic Student Dashboard with calculated Placement Readiness Index (84%).",
                 "Step 4: Navigate to AI Resume Analyzer, select role, and trigger Gemini ATS analysis.",
                 "Step 5: Inspect circular score gauge, matched vs. missing skills, and capstone suggestions."
             ], "STUDENT FLOW", title_color=BRAND)

    add_card(slide13, Inches(6.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "Interview, Quiz & Admin Governance",
             [
                 "Step 6: Start Mock Interview, answer technical question, and show 5-criteria instant scoring.",
                 "Step 7: Launch Aptitude Quiz, demonstrate timer, question palette, and technical explanations.",
                 "Step 8: Switch to Admin Account (admin@careerpilot.ai / AdminPassword123!).",
                 "Step 9: Showcase platform analytics, candidate activation toggle, and Job/Question CRUD.",
                 "Step 10: Demonstrate security: Inspect DevTools to prove token is in HttpOnly cookie."
             ], "ADMIN & VIVA FLOW", title_color=ACCENT)

    # ==================== SLIDE 14: CONCLUSION & FUTURE SCOPE ====================
    slide14 = prs.slides.add_slide(blank_layout)
    add_header(slide14, "Conclusion & Future Enhancements", "Project Summary")

    add_card(slide14, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "Key Achievements",
             [
                 "Delivered a production-ready, full-stack platform addressing real campus placement challenges.",
                 "Integrated cutting-edge AI (Google Gemini 1.5 Flash) with fail-safe heuristic fallback architecture.",
                 "Implemented institutional-grade security with HttpOnly cookies, bcrypt hashing, and rate limiting.",
                 "Exhaustively tested with 70 automated tests and comprehensive academic documentation (SRS, Schema, Viva Guide)."
             ], "ACHIEVEMENTS", title_color=BRAND)

    add_card(slide14, Inches(6.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "Future Scope & Enhancements",
             [
                 "Real-Time Speech-to-Text: Live voice interviews with conversational AI speech synthesis (Whisper/WebSpeech).",
                 "Collaborative Coding Sandbox: Live shared code editor with automated unit test execution via WebSockets.",
                 "College Placement Cell Portal: Institutional dashboard allowing Training & Placement Officers (TPO) to track batch-wide hiring statistics.",
                 "Automated Video Proctoring: Web camera gaze tracking for anti-cheating during campus placement tests."
             ], "ROADMAP", title_color=ACCENT)

    # ==================== SLIDE 15: Q&A / THANK YOU ====================
    slide15 = prs.slides.add_slide(blank_layout)
    bg15 = slide15.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg15.fill.solid()
    bg15.fill.fore_color.rgb = PRIMARY
    bg15.line.fill.background()

    thank_box = slide15.shapes.add_textbox(Inches(1.5), Inches(2.2), Inches(10.3), Inches(3.5))
    tf15 = thank_box.text_frame
    tf15.word_wrap = True

    p_th = tf15.paragraphs[0]
    p_th.text = "Thank You!"
    p_th.font.size = Pt(54)
    p_th.font.bold = True
    p_th.font.color.rgb = WHITE
    p_th.alignment = PP_ALIGN.CENTER
    p_th.space_after = Pt(14)

    p_qa = tf15.add_paragraph()
    p_qa.text = "Questions & Discussion"
    p_qa.font.size = Pt(26)
    p_qa.font.bold = True
    p_qa.font.color.rgb = ACCENT
    p_qa.alignment = PP_ALIGN.CENTER
    p_qa.space_after = Pt(20)

    p_links = tf15.add_paragraph()
    p_links.text = "Project: CareerPilot AI – AI-Based Career and Placement Preparation Platform\nGitHub: github.com/kkt9519/AI-Based-Career-and-Placement-Preparation-Platform\nDepartment of Computer Science & Design"
    p_links.font.size = Pt(15)
    p_links.font.color.rgb = RGBColor(203, 213, 225)
    p_links.alignment = PP_ALIGN.CENTER

    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    out = os.path.abspath("CareerPilot_AI_Presentation.pptx")
    create_presentation(out)
