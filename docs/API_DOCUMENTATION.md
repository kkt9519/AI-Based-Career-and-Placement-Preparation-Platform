# CareerPilot AI – Complete RESTful API Reference Catalog

All endpoints are hosted under the base URI `/api` and accept/return JSON payloads unless processing file uploads (`multipart/form-data`).

---

### Authentication Headers
For endpoints designated **Private**, include the JWT in the standard HTTP `Authorization` header:
```http
Authorization: Bearer <jwt_token_here>
```

---

### 1. Authentication & Account Management (`/api/auth`)

| Method | Endpoint | Access | Request Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | `{ name, email, password, role?, targetRole? }` | Register student or admin account |
| `POST` | `/api/auth/login` | Public | `{ email, password }` | Authenticate and obtain JWT token |
| `GET` | `/api/auth/me` | Private | None | Retrieve authenticated user profile |
| `POST` | `/api/auth/forgot-password` | Public | `{ email }` | Request 10-minute reset token |
| `PUT` | `/api/auth/reset-password/:token`| Public | `{ password }` | Set new password with valid token |

---

### 2. User Profile & Dashboard (`/api/users`)

| Method | Endpoint | Access | Request Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/users/profile` | Private | None | Get user profile details & skills |
| `PUT` | `/api/users/profile` | Private | `{ name?, targetRole?, skills?, careerGoals?, profile? }` | Update profile fields & recompute completion % |
| `GET` | `/api/users/dashboard` | Private | None | Aggregate Placement Readiness Index & counts |

---

### 3. Resume Management & ATS Analyzer (`/api/resumes`)

| Method | Endpoint | Access | Payload | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/resumes/upload` | Private | `multipart/form-data` with `resume` file | Upload PDF/DOCX, parse text, save record |
| `GET` | `/api/resumes` | Private | None | List student's uploaded resumes |
| `GET` | `/api/resumes/:id` | Private | None | Get single resume details |
| `DELETE`| `/api/resumes/:id` | Private | None | Delete resume file and database record |
| `POST` | `/api/resumes/:id/analyze`| Private | `{ targetRole? }` | Execute Gemini ATS analysis & skill gap |
| `GET` | `/api/resumes/analyses/history` | Private | Query: `?limit=10` | Retrieve past ATS analysis reports |

---

### 4. Career Roadmap (`/api/career`)

| Method | Endpoint | Access | Request Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/career/roadmap` | Private | None | Get or auto-generate personalized roadmap |
| `POST` | `/api/career/roadmap` | Private | `{ targetRole }` | Generate / regenerate roadmap for role |
| `PATCH`| `/api/career/roadmap/:id/milestone/:milestoneId` | Private | None | Toggle milestone completion status |

---

### 5. Jobs & Applications Portal (`/api/jobs`)

| Method | Endpoint | Access | Parameters / Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Private | Query: `search, location, workMode, jobType, page, limit` | List jobs with transparent match % |
| `GET` | `/api/jobs/saved` | Private | None | List bookmarked jobs |
| `GET` | `/api/jobs/applications` | Private | None | List student's job applications |
| `GET` | `/api/jobs/:id` | Private | None | Get job details with transparent match reason |
| `POST` | `/api/jobs/:id/save` | Private | None | Bookmark job to student shortlist |
| `DELETE`| `/api/jobs/:id/save` | Private | None | Remove job from student shortlist |
| `POST` | `/api/jobs/:id/apply` | Private | `{ notes? }` | Submit placement application |

---

### 6. AI Mock Interview Simulator (`/api/interviews`)

| Method | Endpoint | Access | Parameters / Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/interviews/start` | Private | `{ interviewType, role, difficulty, totalQuestions }` | Initiate interview session with questions |
| `POST` | `/api/interviews/:id/answer` | Private | `{ questionIndex, userAnswer }` | Submit answer for 5-criteria AI scoring |
| `POST` | `/api/interviews/:id/finish` | Private | None | Conclude session & compute final score |
| `GET` | `/api/interviews/history` | Private | Query: `page, limit` | List student's past mock interview sessions |
| `GET` | `/api/interviews/:id` | Private | None | Get full session review transcript |

---

### 7. Aptitude & Coding Practice (`/api/assessments`)

| Method | Endpoint | Access | Parameters / Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/assessments/questions` | Private | Query: `category, difficulty, type, page, limit` | Browse questions (answers stripped) |
| `POST` | `/api/assessments/start` | Private | `{ category, difficulty, totalQuestions }` | Start timed test with randomized questions |
| `POST` | `/api/assessments/:id/submit` | Private | `{ answers, timeSpentSeconds }` | Submit answers, score test & get viva explanations |
| `GET` | `/api/assessments/history` | Private | Query: `page, limit` | List student's completed tests |
| `GET` | `/api/assessments/stats` | Private | None | Get category-wise performance breakdown |
| `GET` | `/api/assessments/:id` | Private | None | Get single test report |

---

### 8. Admin Console & Platform Management (`/api/admin`)
*All endpoints require `role === 'admin'`.*

| Method | Endpoint | Access | Request Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Admin | None | Live platform KPI counts & recent activity |
| `GET` | `/api/admin/users` | Admin | Query: `role, search, page, limit` | Filter and paginate registered users |
| `PATCH`| `/api/admin/users/:id/status` | Admin | `{ isActive: boolean }` | Activate or suspend user account |
| `POST` | `/api/admin/jobs` | Admin | `{ title, company, description, requiredSkills, ... }` | Post new job or internship |
| `PUT` | `/api/admin/jobs/:id` | Admin | `{ ...fieldsToUpdate }` | Update existing job posting |
| `DELETE`| `/api/admin/jobs/:id` | Admin | None | Delete job posting & applications |
| `POST` | `/api/admin/questions` | Admin | `{ title, category, options, explanation, ... }` | Add question to Question Bank |
| `PUT` | `/api/admin/questions/:id` | Admin | `{ ...fieldsToUpdate }` | Update question |
| `DELETE`| `/api/admin/questions/:id`| Admin | None | Delete question |
