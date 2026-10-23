import os
from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pdf(output_filename):
    # Widescreen 16:9 landscape dimensions (960 x 540 points)
    PAGE_WIDTH = 960
    PAGE_HEIGHT = 540

    c = canvas.Canvas(output_filename, pagesize=(PAGE_WIDTH, PAGE_HEIGHT))

    # Color Palette
    PRIMARY = HexColor("#1E1B4B")      # Deep Navy/Indigo
    PRIMARY_LIGHT = HexColor("#2E1065")
    BRAND = HexColor("#2563EB")        # Brand Blue
    BRAND_LIGHT = HexColor("#3B82F6")
    ACCENT = HexColor("#10B981")       # Emerald Green
    ACCENT_LIGHT = HexColor("#34D399")
    ROSE = HexColor("#E11D48")         # Rose
    AMBER = HexColor("#D97706")        # Amber
    SLATE_900 = HexColor("#0F172A")    # Dark text
    SLATE_700 = HexColor("#334155")
    SLATE_500 = HexColor("#64748B")    # Muted text
    SLATE_100 = HexColor("#F1F5F9")    # Card bg
    SLATE_50 = HexColor("#F8FAFC")     # Page bg
    BORDER = HexColor("#E2E8F0")
    WHITE = HexColor("#FFFFFF")

    def draw_slide_base(title, category="FINAL YEAR B.TECH CAPSTONE PROJECT", slide_num=1, total_slides=15):
        # Background
        c.setFillColor(SLATE_50)
        c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=True, stroke=False)

        # Header Category Badge
        c.setFillColor(BRAND)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(50, PAGE_HEIGHT - 38, category.upper())

        # Slide Title
        c.setFillColor(PRIMARY)
        c.setFont("Helvetica-Bold", 22)
        c.drawString(50, PAGE_HEIGHT - 65, title)

        # Subtle decorative divider line
        c.setStrokeColor(BORDER)
        c.setLineWidth(1)
        c.line(50, PAGE_HEIGHT - 75, PAGE_WIDTH - 50, PAGE_HEIGHT - 75)

        # Footer
        c.setFont("Helvetica", 9)
        c.setFillColor(SLATE_500)
        c.drawString(50, 22, "CareerPilot AI – AI-Based Career and Placement Preparation Platform")
        c.drawRightString(PAGE_WIDTH - 50, 22, f"Slide {slide_num} of {total_slides}")

    def draw_card(x, y, w, h, title, items, title_color=BRAND, badge=None, bg_color=WHITE):
        # Card shadow & border
        c.setFillColor(bg_color)
        c.setStrokeColor(BORDER)
        c.setLineWidth(1)
        c.roundRect(x, y, w, h, 10, fill=True, stroke=True)

        # Header accent bar
        c.setFillColor(title_color)
        c.roundRect(x, y + h - 6, w, 6, 3, fill=True, stroke=False)

        # Title
        c.setFillColor(title_color)
        c.setFont("Helvetica-Bold", 13)
        title_y = y + h - 26
        if badge:
            c.drawString(x + 18, title_y, f"[{badge}]  {title}")
        else:
            c.drawString(x + 18, title_y, title)

        # Bullet items
        cur_y = title_y - 20
        c.setFont("Helvetica", 10)
        line_height = 14

        for item in items:
            # Bullet point symbol
            c.setFillColor(title_color)
            c.circle(x + 22, cur_y - 3, 2.5, fill=True, stroke=False)

            # Item text with word wrap
            c.setFillColor(SLATE_700)
            words = item.split(" ")
            line = ""
            max_width = w - 45

            for word in words:
                test_line = line + word + " "
                if c.stringWidth(test_line, "Helvetica", 10) < max_width:
                    line = test_line
                else:
                    c.drawString(x + 32, cur_y, line.strip())
                    cur_y -= line_height
                    line = word + " "
            if line:
                c.drawString(x + 32, cur_y, line.strip())
                cur_y -= (line_height + 4)

    # ==================== SLIDE 1: TITLE SLIDE ====================
    c.setFillColor(PRIMARY)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=True, stroke=False)

    # Decorative background elements
    c.setFillColor(PRIMARY_LIGHT)
    c.circle(PAGE_WIDTH - 80, PAGE_HEIGHT - 60, 220, fill=True, stroke=False)

    # Badge
    c.setFillColor(ACCENT_LIGHT)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(70, PAGE_HEIGHT - 120, "FINAL YEAR B.TECH CAPSTONE PROJECT PRESENTATION")

    # Main Title
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 46)
    c.drawString(70, PAGE_HEIGHT - 180, "CareerPilot AI")

    # Subtitle
    c.setFillColor(HexColor("#93C5FD"))
    c.setFont("Helvetica-Bold", 20)
    c.drawString(70, PAGE_HEIGHT - 215, "AI-Based Career and Placement Preparation Platform")

    # Description Paragraph
    c.setFillColor(HexColor("#E2E8F0"))
    c.setFont("Helvetica", 12)
    c.drawString(70, PAGE_HEIGHT - 260, "An institutional full-stack platform bridging academic curricula and corporate engineering hiring.")
    c.drawString(70, PAGE_HEIGHT - 278, "Featuring Google Gemini AI ATS resume parsing, real-time mock interviews, and automated readiness analytics.")

    # Details Box
    c.setFillColor(HexColor("#111827"))
    c.roundRect(70, 70, PAGE_WIDTH - 140, 110, 12, fill=True, stroke=False)

    c.setFillColor(ACCENT)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(95, 150, "PROJECT METRICS & SPECIFICATIONS")

    c.setFillColor(WHITE)
    c.setFont("Helvetica", 10)
    c.drawString(95, 130, "• Department: Computer Science & Design / Engineering")
    c.drawString(95, 112, "• Academic Year: 2025–2026")
    c.drawString(95, 94, "• Architecture: React 18, Node.js, Express, MongoDB, Google Gemini 1.5 Flash, Tailwind CSS")

    c.drawString(540, 130, "• Quality Assurance: 70 Automated Tests Passed (100% Pass Rate)")
    c.drawString(540, 112, "• Security Model: HttpOnly SameSite Cookie Sessions + Bcrypt Hashing")
    c.drawString(540, 94, "• Repository: github.com/kkt9519/AI-Based-Career-and-Placement-Preparation-Platform")

    c.showPage()

    # ==================== SLIDE 2: PROBLEM STATEMENT ====================
    draw_slide_base("Problem Statement & Placement Challenges", "Industry Gap", 2)
    card_w = (PAGE_WIDTH - 100 - 36) / 3
    card_h = 390
    card_y = 65

    draw_card(50, card_y, card_w, card_h, "1. Automated ATS Filtering", [
        "Over 75% of candidate resumes are filtered out by automated ATS before human recruiter review.",
        "Students lack objective feedback on missing technical keywords, formatting errors, and unparsed tables.",
        "Generic resumes fail to showcase project metrics and measurable business outcomes."
    ], ROSE, "THE ATS GAP")

    draw_card(50 + card_w + 18, card_y, card_w, card_h, "2. Interview Anxiety & Void", [
        "Students experience intense anxiety during on-campus technical and HR placement rounds.",
        "Limited access to experienced technical interviewers for personalized feedback and mock practice.",
        "Subjective evaluation without multi-criteria scoring rubrics across technical accuracy and clarity."
    ], AMBER, "INTERVIEW VOID")

    draw_card(50 + (card_w + 18)*2, card_y, card_w, card_h, "3. Fragmented Ecosystem", [
        "Students juggle disconnected resources: LeetCode for DSA, YouTube for roadmaps, and uncalibrated job boards.",
        "No single metric tracks overall 'Placement Readiness Index' (0–100%).",
        "College placement cells lack visibility into candidate readiness and cohort-wide skill gaps."
    ], BRAND, "FRAGMENTED TOOLS")

    c.showPage()

    # ==================== SLIDE 3: SOLUTION & OBJECTIVES ====================
    draw_slide_base("Proposed Solution & Project Objectives", "System Vision", 3)
    card_w2 = (PAGE_WIDTH - 100 - 24) / 2

    draw_card(50, card_y, card_w2, card_h, "Core Project Objectives", [
        "AI Resume ATS Analyzer: Parse multi-format documents (.pdf/.docx) and compute 0-100 ATS scores with 4-category breakdowns.",
        "AI Mock Interview Studio: Interactive timed technical and HR interview rounds with 5-criteria instant scoring.",
        "Aptitude & Coding Practice: Timed test engine spanning Quant, Logical, Verbal, Core CS, and LeetCode-style challenges.",
        "Placement Roadmaps & Job Portal: Milestone checklists and job compatibility algorithm: 75% Required + 25% Preferred.",
        "Admin Console: Institutional candidate governance, analytics KPIs, and Question Bank CRUD."
    ], BRAND, "OBJECTIVES")

    draw_card(50 + card_w2 + 24, card_y, card_w2, card_h, "The CareerPilot AI Innovations", [
        "Dual-Engine AI Architecture: Combines Google Gemini 1.5 Flash with a Semantic Heuristic Fallback Engine for 100% uptime.",
        "Real-Time Readiness Index: Dynamically aggregates profile completion, resume ATS score, interview performance, and test results.",
        "Skill Gap Matrix: Contrasts student competencies against real target job roles (MERN, Java, Full Stack).",
        "Enterprise Security: HttpOnly SameSite cookie authentication, bcrypt hashing, and strict role guards.",
        "Zero Paid API Dependency in CI: 70 automated tests validating all endpoints with mock isolation."
    ], ACCENT, "INNOVATION")

    c.showPage()

    # ==================== SLIDE 4: SYSTEM ARCHITECTURE ====================
    draw_slide_base("Full-Stack System Architecture (MERN Monorepo)", "Engineering", 4)
    draw_card(50, card_y, card_w, card_h, "Frontend (Vite + React 18)", [
        "React 18 Single Page Application styled with modern Tailwind CSS 3.4.",
        "Axios instance with withCredentials: true for automatic HttpOnly cookie transmission.",
        "Client routing secured by ProtectedRoute and AdminRoute components.",
        "Interactive circular SVG gauges, category progress bars, and timed quiz interfaces.",
        "Zero long-lived tokens in localStorage to eliminate XSS token theft."
    ], BRAND, "PRESENTATION")

    draw_card(50 + card_w + 18, card_y, card_w, card_h, "Backend (Express & Node.js)", [
        "Modular REST API architecture: Controllers, Middleware, Routes, Validators, and Services.",
        "Token retrieval from HttpOnly cookies with Bearer header fallback for testing.",
        "Multer file streaming + pdf-parse & mammoth text sanitization.",
        "Dedicated authLimiter blocking brute-force credential stuffing.",
        "Centralized error handling with Zod validation schemas."
    ], PRIMARY, "APPLICATION LAYER")

    draw_card(50 + (card_w + 18)*2, card_y, card_w, card_h, "Database & AI Services", [
        "MongoDB with Mongoose ODM modeling 10 distinct collections with indexes.",
        "Bcrypt password hashing (10 salt rounds) in pre-save hooks.",
        "Google Gemini 1.5 Flash official SDK integration.",
        "Deterministic Semantic Fallback Engine ensuring 100% viva availability.",
        "Disk cleanup on resume deletion to prevent storage leaks."
    ], ACCENT, "DATA & AI LAYER")

    c.showPage()

    # ==================== SLIDE 5: AI RESUME ANALYZER ====================
    draw_slide_base("Module 1: AI Resume Analyzer & ATS Scorer", "Core Feature", 5)
    draw_card(50, card_y, card_w2, card_h, "Multi-Format Ingestion & Parsing", [
        "Multi-Format Upload: Accepts .pdf and .docx documents up to 5MB via Multer.",
        "Text Sanitization: pdf-parse strips non-printable control characters and collapses multi-line whitespace.",
        "Role Calibration: Calibrates resume keywords against target roles: MERN Stack, Java Developer, Full Stack, Frontend.",
        "Dual-Engine Execution: Sends structured JSON prompt to Gemini 1.5 Flash; automatically falls back to heuristic engine if quota is exceeded.",
        "Disk Cleanup: Corrupt files and deleted resumes are immediately unlinked from physical storage."
    ], BRAND, "INGESTION PIPELINE")

    draw_card(50 + card_w2 + 24, card_y, card_w2, card_h, "Evaluation Output & Feedback", [
        "Overall Score: Recruiter-calibrated score out of 100.",
        "Category Breakdown: Impact & Metrics, Completeness, Technical Skills, and ATS Formatting.",
        "Skill Gap Matrix: Visual chips contrasting identified skills vs. missing competencies.",
        "Actionable Feedback: Profile strengths, weaknesses, and concrete recommendations to boost pass rates.",
        "Capstone Project Ideas: Recommends project ideas to bridge detected missing skills.",
        "Academic Disclaimer: Explicitly notes the score is an educational preparation metric, not an employer hiring decision."
    ], ACCENT, "ANALYTICS & REPORT")

    c.showPage()

    # ==================== SLIDE 6: AI MOCK INTERVIEW STUDIO ====================
    draw_slide_base("Module 2: AI Mock Interview Studio", "Interactive Simulation", 6)
    draw_card(50, card_y, card_w, card_h, "Interview Tracks", [
        "Technical Track: Role-specific questions covering JavaScript, React, Node.js, Spring Boot, SQL, and DSA.",
        "HR / Behavioral Track: Situational questions assessing teamwork, leadership, conflict resolution, and STAR methodology.",
        "Live Countdown Timer: Replicates authentic placement test pressure.",
        "Question State: Sequential answering with client-side state preservation."
    ], BRAND, "MODES")

    draw_card(50 + card_w + 18, card_y, card_w, card_h, "5-Criteria AI Evaluation", [
        "1. Relevance (20 pts): Does answer address the specific question?",
        "2. Technical Accuracy (20 pts): Are technical terms and concepts correct?",
        "3. Clarity & Structure (20 pts): Is explanation coherent?",
        "4. Completeness (20 pts): Are edge cases and examples mentioned?",
        "5. Communication (20 pts): Is phrasing professional and articulate?"
    ], AMBER, "RUBRIC")

    draw_card(50 + (card_w + 18)*2, card_y, card_w, card_h, "Viva Coaching Feedback", [
        "Instant AI Critiques: Question-by-question scoring and strengths.",
        "Viva Phrasing Tips: Recommends improved answers for campus placement interviews.",
        "Performance Report: Overall score out of 100 with category badges.",
        "Interview History: Comprehensive session logs preserved in MongoDB."
    ], ACCENT, "ACTIONABLE REPORT")

    c.showPage()

    # ==================== SLIDE 7: APTITUDE & CODING PRACTICE ====================
    draw_slide_base("Module 3: Aptitude & Coding Practice Suite", "Placement Tests", 7)
    draw_card(50, card_y, card_w2, card_h, "5 Assessment Domains", [
        "Quantitative Aptitude: Time & Work, Speed & Distance, Profit & Loss, Percentages, and Probability.",
        "Logical Reasoning: Syllogisms, Coding-Decoding, Blood Relations, and Number Series.",
        "Verbal Ability: Sentence Correction, Reading Comprehension, and Technical Phrasing.",
        "Core CS Subjects: Data Structures, Operating Systems (Threads, Deadlocks), DBMS (SQL, Normalization), Networks.",
        "Coding Challenges: Algorithmic problem-solving with time and space complexity constraints."
    ], BRAND, "CONTENT DOMAINS")

    draw_card(50 + card_w2 + 24, card_y, card_w2, card_h, "Testing Room & Solutions", [
        "Interactive Question Palette: Tracks Answered, Flagged for Review, and Unvisited questions in real time.",
        "Timed Session Engine: Real-time clock with automatic test submission on timer expiration.",
        "Detailed Viva Explanations: Every question includes step-by-step mathematical or code solutions.",
        "Sanitized Delivery: Correct answers are never sent to client during active tests.",
        "Historical Analytics: Category-wise accuracy breakdown (Quant vs. Core CS vs. Coding)."
    ], ACCENT, "TEST ENGINE")

    c.showPage()

    # ==================== SLIDE 8: ROADMAPS & PLACEMENT PORTAL ====================
    draw_slide_base("Module 4: Career Roadmaps & Placement Portal", "Career Progression", 8)
    draw_card(50, card_y, card_w2, card_h, "Milestone Career Roadmaps", [
        "Curated learning roadmaps for MERN Stack, Java Developer, Full Stack, and Frontend engineers.",
        "Interactive checklist items with real-time percentage completion calculation.",
        "Curated references to industry documentation, open-source guides, and DSA sheets.",
        "Guided project recommendations to bridge detected resume skill gaps."
    ], BRAND, "ROADMAPS")

    draw_card(50 + card_w2 + 24, card_y, card_w2, card_h, "Placement & Internship Portal", [
        "Transparent Match Formula: Match % = (75% × Required Match) + (25% × Preferred Match).",
        "Job Exploration: Filter placement opportunities by work mode (Remote, Hybrid, Onsite) and job type.",
        "Shortlisting: Bookmark jobs for quick access.",
        "1-Click Application: Submit applications with personal notes, tracked across Applied, Review, and Shortlisted statuses."
    ], ACCENT, "PLACEMENTS")

    c.showPage()

    # ==================== SLIDE 9: ADMIN CONSOLE ====================
    draw_slide_base("Module 5: Admin Governance Console", "Institutional Control", 9)
    draw_card(50, card_y, card_w, card_h, "Platform Analytics", [
        "Live KPI metrics aggregated directly from MongoDB collections.",
        "Total registered student counts across college batches.",
        "Total parsed resumes and ATS score distributions.",
        "Completed mock interviews and average candidate scores.",
        "Active job listings and total applications tracked."
    ], BRAND, "KPIS")

    draw_card(50 + card_w + 18, card_y, card_w, card_h, "Candidate Governance", [
        "Paginated student directory with search filters by name, email, and target role.",
        "1-Click Account Status Toggle: Activate or Suspend candidates.",
        "Inspect student readiness index and resume scores.",
        "Strict RBAC: Protected by requireRole('admin') guard."
    ], PRIMARY, "STUDENT GOVERNANCE")

    draw_card(50 + (card_w + 18)*2, card_y, card_w, card_h, "Job & Question CRUD", [
        "Full CRUD controls to add, update, and delete placement job openings.",
        "Question Bank Management: Add, update, and remove questions.",
        "Category tagging across Quant, Core CS, and Coding."
    ], ACCENT, "CONTENT MANAGEMENT")

    c.showPage()

    # ==================== SLIDE 10: SECURITY ARCHITECTURE ====================
    draw_slide_base("Enterprise Security & Authentication Architecture", "Security & RBAC", 10)
    draw_card(50, card_y, card_w2, card_h, "HttpOnly Cookie Sessions", [
        "Zero Long-Lived Tokens in localStorage: JWT is delivered strictly in HttpOnly, SameSite cookies with path /.",
        "XSS Mitigation: Client JavaScript cannot read the token, neutralizing XSS exfiltration risks.",
        "Dual Token Acceptance: Middleware inspects cookies first, falling back to Bearer tokens for test suites and scripts.",
        "Session Termination: Logout endpoint explicitly clears cookie with Expired timestamp (1970-01-01).",
        "CORS with Credentials: Configured with credentials: true and dynamic origin validation."
    ], BRAND, "COOKIE SESSIONS")

    draw_card(50 + card_w2 + 24, card_y, card_w2, card_h, "Privilege Defense & Hardening", [
        "Bcrypt Password Encryption: 10 salt rounds in pre-save hooks; plain text never stored.",
        "select: false: Password field is excluded from queries by default.",
        "Privilege Defense: Public registration strictly enforces role: 'student'. Users cannot grant themselves admin status.",
        "Rate Limiting: authLimiter caps auth requests to 25 / 15 min to prevent credential brute-forcing.",
        "Safe Error Messages: Generic 'Invalid email or password' message prevents user enumeration."
    ], ACCENT, "PRIVILEGE DEFENSE")

    c.showPage()

    # ==================== SLIDE 11: DATABASE SCHEMA ====================
    draw_slide_base("Database Design & Schema Architecture (MongoDB)", "Database Modeling", 11)
    draw_card(50, card_y, card_w2, card_h, "User & Evaluation Collections", [
        "User: Credentials, profile (CGPA, degree, links), target role, skills, accountStatus.",
        "Resume: User reference, file metadata, physical storage path, cleaned extracted text.",
        "ResumeAnalysis: Overall score, 4 category scores, identified/missing skills, recommendations, disclaimer.",
        "InterviewSession: Track (Tech/HR), target role, questions, answers, 5-criteria scores, critiques.",
        "CareerRoadmap: Personalized milestones, checklist items, and completion percentages."
    ], BRAND, "COLLECTIONS 1-5")

    draw_card(50 + card_w2 + 24, card_y, card_w2, card_h, "Placement & Practice Collections", [
        "Job: Title, company, location, type, required & preferred skills, salary, deadline.",
        "SavedJob: Candidate bookmark references.",
        "JobApplication: Application notes and status tracking (applied, review, shortlisted).",
        "Question: Category, difficulty, question text, options, correct answer, viva explanation.",
        "Assessment: Timed session records, answers submitted, score breakdown, and time spent."
    ], ACCENT, "COLLECTIONS 6-10")

    c.showPage()

    # ==================== SLIDE 12: TESTING & VERIFICATION ====================
    draw_slide_base("Testing, Verification & Quality Assurance", "Robustness", 12)
    draw_card(50, card_y, card_w, card_h, "100% Automated Test Pass", [
        "8 Test Suites: 70 out of 70 automated tests pass cleanly.",
        "auth.test.js (15 tests covering registration, cookies, password hashing).",
        "resume_analyzer_isolated.test.js (12 tests with mocked Gemini AI).",
        "admin.test.js (9 tests for RBAC, user governance, job CRUD).",
        "profile_resume.test.js (8 tests), jobs.test.js (7 tests), interview.test.js (7 tests)."
    ], ACCENT, "70/70 TESTS PASSED")

    draw_card(50 + card_w + 18, card_y, card_w, card_h, "Mock Isolation (Zero Cost)", [
        "Uses jest.mock('@google/generative-ai') to eliminate external API dependencies.",
        "Guarantees zero paid API calls during automated CI/CD runs.",
        "Tests verify automatic fallback if AI quota is exhausted.",
        "Tests verify 401 on unauthenticated access to student dashboard."
    ], BRAND, "ISOLATION")

    draw_card(50 + (card_w + 18)*2, card_y, card_w, card_h, "Build & Deployment Ready", [
        "Frontend compiles cleanly via npm run build (Vite).",
        "frontend/vercel.json configured for SPA client routing.",
        "render.yaml configured for automated backend deployment.",
        "Clean main branch on GitHub with zero credentials checked in."
    ], PRIMARY, "DEPLOYMENT READY")

    c.showPage()

    # ==================== SLIDE 13: LIVE DEMO HIGHLIGHTS ====================
    draw_slide_base("Live Demonstration Walkthrough (5-Minute Viva Plan)", "Viva Demo", 13)
    draw_card(50, card_y, card_w2, card_h, "Student Flow Demonstration", [
        "1. Open http://localhost:5173 on web browser.",
        "2. 1-Click Demo Login as Student (student@careerpilot.ai).",
        "3. Demonstrate Student Dashboard with real-time Placement Readiness Index (84%).",
        "4. Navigate to AI Resume Analyzer, select role, and trigger Gemini ATS evaluation.",
        "5. Inspect circular gauge, category bars, identified vs. missing skills, and capstone suggestions."
    ], BRAND, "STUDENT EXPERIENCE")

    draw_card(50 + card_w2 + 24, card_y, card_w2, card_h, "Interview, Quiz & Admin Governance", [
        "6. Start Mock Interview, answer technical question, and show 5-criteria instant scoring.",
        "7. Launch Aptitude Quiz, demonstrate timer, question palette, and technical explanations.",
        "8. Switch to Admin Account (admin@careerpilot.ai).",
        "9. Showcase platform KPI cards, candidate status toggle, and Job/Question CRUD.",
        "10. Show DevTools Application tab: prove token is stored in HttpOnly cookie."
    ], ACCENT, "ADMIN & VIVA FLOW")

    c.showPage()

    # ==================== SLIDE 14: CONCLUSION & FUTURE SCOPE ====================
    draw_slide_base("Conclusion & Future Enhancements", "Project Summary", 14)
    draw_card(50, card_y, card_w2, card_h, "Key Project Achievements", [
        "Delivered a production-ready, full-stack platform addressing real campus placement challenges.",
        "Integrated cutting-edge AI (Google Gemini 1.5 Flash) with fail-safe heuristic fallback architecture.",
        "Implemented institutional-grade security with HttpOnly cookies, bcrypt hashing, and rate limiting.",
        "Exhaustively tested with 70 automated tests and comprehensive academic documentation."
    ], BRAND, "ACHIEVEMENTS")

    draw_card(50 + card_w2 + 24, card_y, card_w2, card_h, "Future Roadmap", [
        "Real-Time Speech-to-Text: Live voice interviews with conversational AI speech synthesis (Whisper API).",
        "Collaborative Coding Sandbox: Live shared code editor with automated unit test execution via WebSockets.",
        "College Placement Cell Portal: Institutional dashboard allowing Training & Placement Officers (TPO) to track batch-wide hiring statistics."
    ], ACCENT, "FUTURE WORK")

    c.showPage()

    # ==================== SLIDE 15: Q&A / THANK YOU ====================
    c.setFillColor(PRIMARY)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=True, stroke=False)

    c.setFillColor(PRIMARY_LIGHT)
    c.circle(PAGE_WIDTH / 2, PAGE_HEIGHT / 2, 280, fill=True, stroke=False)

    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 54)
    c.drawCentredString(PAGE_WIDTH / 2, PAGE_HEIGHT / 2 + 50, "Thank You!")

    c.setFillColor(ACCENT_LIGHT)
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(PAGE_WIDTH / 2, PAGE_HEIGHT / 2 - 5, "Questions & Viva Discussion")

    c.setFillColor(HexColor("#CBD5E1"))
    c.setFont("Helvetica", 13)
    c.drawCentredString(PAGE_WIDTH / 2, PAGE_HEIGHT / 2 - 55, "CareerPilot AI – AI-Based Career and Placement Preparation Platform")
    c.drawCentredString(PAGE_WIDTH / 2, PAGE_HEIGHT / 2 - 75, "Department of Computer Science & Design")
    c.setFillColor(HexColor("#93C5FD"))
    c.drawCentredString(PAGE_WIDTH / 2, PAGE_HEIGHT / 2 - 100, "GitHub: github.com/kkt9519/AI-Based-Career-and-Placement-Preparation-Platform")

    c.showPage()

    # Save PDF
    c.save()
    print(f"PDF Presentation generated successfully at: {output_filename}")

if __name__ == "__main__":
    out_file = os.path.abspath("CareerPilot_AI_Presentation.pdf")
    generate_pdf(out_file)
