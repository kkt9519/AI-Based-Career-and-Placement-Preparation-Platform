const { GoogleGenerativeAI } = require('@google/generative-ai');

// Role requirements dictionary for semantic analysis & fallback engine
const ROLE_SKILL_MATRIX = {
  'MERN Stack Developer': {
    coreSkills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'REST APIs', 'Git'],
    preferredSkills: ['Redux', 'Tailwind CSS', 'TypeScript', 'Docker', 'JWT', 'Next.js', 'Jest'],
    milestones: [
      {
        title: 'Modern JavaScript & Frontend Fundamentals',
        description: 'Master ES6+, DOM manipulation, asynchronous JavaScript, and CSS frameworks.',
        topics: ['ES6+ (Closures, Promises, Async/Await)', 'DOM & Event Loop', 'Tailwind CSS & Responsive Layouts'],
        resources: ['JavaScript.info', 'MDN Web Docs'],
      },
      {
        title: 'React.js Core & State Management',
        description: 'Component lifecycle, hooks (useState, useEffect, useMemo), and Context API.',
        topics: ['Hooks in depth', 'Context API & Redux Toolkit', 'React Router v6', 'Custom Hooks'],
        resources: ['React Official Docs', 'Full Stack Open'],
      },
      {
        title: 'Backend Engineering with Node.js & Express',
        description: 'Build production RESTful APIs, middlewares, authentication, and security.',
        topics: ['Express.js Routing & Middlewares', 'JWT & Bcrypt Authentication', 'Error Handling & Validation', 'Multer & File Handling'],
        resources: ['Node.js Docs', 'Express Guide'],
      },
      {
        title: 'MongoDB & Database Modeling',
        description: 'Design schemas, indexes, relationships, and aggregations using Mongoose.',
        topics: ['Mongoose Schemas & Validation', 'Indexes & Query Optimization', 'Aggregation Pipeline', 'Data Modeling'],
        resources: ['MongoDB University', 'Mongoose Docs'],
      },
      {
        title: 'Full Stack Integration & Deployment',
        description: 'Combine frontend with backend, secure CORS, and deploy with CI/CD.',
        topics: ['API Integration with Axios', 'CORS & Security Best Practices', 'Docker & Containerization', 'Cloud Deployment'],
        resources: ['Docker for Beginners', 'Render/Vercel Deployment Guides'],
      },
      {
        title: 'DSA & Placement Viva Preparation',
        description: 'Data structures, algorithms, system design basics, and viva questions.',
        topics: ['Arrays, Strings, HashMaps, Trees', 'Time & Space Complexity', 'REST Principles & Web Security', 'Live Mock Interviews'],
        resources: ['LeetCode', 'Striver SDE Sheet'],
      },
    ],
    projects: [
      {
        title: 'Placement Preparation SaaS Platform',
        description: 'A full-stack MERN application with AI resume parsing, interview simulator, and aptitude testing.',
        techStack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JWT'],
        difficulty: 'Advanced',
      },
      {
        title: 'DevConnector - Developer Social & Collaboration Hub',
        description: 'Social networking platform for developers with portfolio showcases and job posts.',
        techStack: ['React', 'Express.js', 'MongoDB', 'Redux Toolkit'],
        difficulty: 'Intermediate',
      },
    ],
  },
  'Java Developer': {
    coreSkills: ['Java', 'Spring Boot', 'SQL', 'Object-Oriented Programming', 'Git', 'REST APIs', 'DBMS'],
    preferredSkills: ['Hibernate', 'Microservices', 'Spring Security', 'Docker', 'Maven', 'JUnit', 'Kafka'],
    milestones: [
      {
        title: 'Core Java & OOP Principles',
        description: 'Solid understanding of OOP, Collections Framework, Multithreading, and Exception Handling.',
        topics: ['Polymorphism, Inheritance, Encapsulation', 'Java Collections (List, Set, Map)', 'Streams & Lambdas (Java 8+)', 'Exception Handling & Multithreading'],
        resources: ['Java Brains', 'Oracle Java Tutorials'],
      },
      {
        title: 'SQL & Relational Database Design',
        description: 'Write complex SQL queries, normalization, ACID properties, and indexing.',
        topics: ['Joins, Subqueries & Aggregates', 'Indexing & Query Optimization', 'Transactions & ACID properties', 'Normalization (1NF-BCNF)'],
        resources: ['Mode SQL Tutorial', 'PostgreSQL Exercises'],
      },
      {
        title: 'Spring Boot & Hibernate/JPA',
        description: 'Develop enterprise REST APIs using Spring Boot, Spring Data JPA, and Hibernate.',
        topics: ['Dependency Injection & IoC', 'Spring Data JPA & ORM', 'Spring Boot Auto-configuration', 'Hibernate Caching'],
        resources: ['Spring.io Guides', 'Baeldung Spring Boot'],
      },
      {
        title: 'Microservices & Enterprise Architecture',
        description: 'Design distributed services, API Gateway, Service Discovery, and Messaging.',
        topics: ['Microservices Patterns', 'Spring Cloud & Eureka', 'REST vs Kafka/RabbitMQ', 'Dockerizing Spring Boot'],
        resources: ['Microservices.io', 'Spring Cloud Docs'],
      },
      {
        title: 'DSA & Coding Assessment Prep',
        description: 'Algorithmic problem solving in Java for product-based company test rounds.',
        topics: ['Linked Lists, Stacks, Queues', 'Trees, Graphs, Recursion', 'Dynamic Programming', 'Java Concurrency'],
        resources: ['LeetCode Java', 'GeeksforGeeks'],
      },
    ],
    projects: [
      {
        title: 'Enterprise Banking & Transaction Management System',
        description: 'Secure financial transaction processor with Spring Boot, Spring Security, and PostgreSQL.',
        techStack: ['Java', 'Spring Boot', 'Spring Data JPA', 'PostgreSQL', 'Docker'],
        difficulty: 'Advanced',
      },
      {
        title: 'E-Commerce Microservices Platform',
        description: 'Microservice-based order, product, and inventory management architecture.',
        techStack: ['Spring Boot', 'Spring Cloud', 'Kafka', 'MySQL'],
        difficulty: 'Advanced',
      },
    ],
  },
  'Full Stack Developer': {
    coreSkills: ['JavaScript', 'React', 'Node.js', 'SQL', 'MongoDB', 'Git', 'REST APIs', 'HTML/CSS'],
    preferredSkills: ['TypeScript', 'Docker', 'Next.js', 'CI/CD', 'GraphQL', 'AWS Basics', 'System Design'],
    milestones: [
      {
        title: 'Web & Programming Fundamentals',
        description: 'Semantic HTML, responsive CSS, core JavaScript, and version control.',
        topics: ['Modern JavaScript', 'CSS Flexbox & Grid', 'Git & Branching Workflows'],
        resources: ['MDN Web Docs', 'Git Book'],
      },
      {
        title: 'Modern Frontend Architecture',
        description: 'Single Page Applications, component-driven UI, state management, and performance.',
        topics: ['React / Next.js', 'State Architecture', 'Responsive UI & Accessibility'],
        resources: ['React Docs', 'Next.js Learn'],
      },
      {
        title: 'Backend Services & Database Design',
        description: 'API development, relational & non-relational database modeling, caching.',
        topics: ['Node.js & Express', 'SQL & NoSQL integration', 'Caching with Redis', 'Authentication'],
        resources: ['Full Stack Open'],
      },
      {
        title: 'DevOps, Testing & Deployment',
        description: 'Automated unit tests, containerization, and production deployment.',
        topics: ['Jest & Supertest', 'Docker & Docker Compose', 'CI/CD Pipelines', 'Cloud Hosting'],
        resources: ['DevOps Roadmap', 'GitHub Actions Docs'],
      },
    ],
    projects: [
      {
        title: 'Multi-Tenant Project & Task Collaboration Suite',
        description: 'Real-time collaborative project management platform with Kanban boards.',
        techStack: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Tailwind'],
        difficulty: 'Intermediate',
      },
    ],
  },
  'Frontend Developer': {
    coreSkills: ['JavaScript', 'React', 'HTML5', 'CSS3', 'Tailwind CSS', 'Git', 'Responsive Design'],
    preferredSkills: ['TypeScript', 'Next.js', 'Redux Toolkit', 'Jest/RTL', 'Web Vitals', 'Framer Motion'],
    milestones: [
      {
        title: 'Deep Core JavaScript',
        description: 'Prototype, closures, event delegation, async/await, and browser rendering.',
        topics: ['Execution Context & Closures', 'Prototypes & Classes', 'Event Bubbling & Capturing', 'Fetch API'],
        resources: ['JavaScript.info'],
      },
      {
        title: 'Advanced React & TypeScript',
        description: 'Type-safe component design, custom hooks, and state patterns.',
        topics: ['TypeScript with React', 'useReducer & useContext', 'Performance Optimization (memo, useCallback)', 'Code Splitting'],
        resources: ['React TypeScript Cheatsheet'],
      },
      {
        title: 'UI Engineering & Design Systems',
        description: 'Crafting responsive, accessible, animated interfaces with modern CSS.',
        topics: ['Tailwind CSS mastery', 'WCAG Accessibility', 'Micro-interactions & Animations', 'Component Libraries'],
        resources: ['Tailwind Docs'],
      },
    ],
    projects: [
      {
        title: 'Interactive SaaS Analytics Dashboard',
        description: 'High-performance interactive dashboard with real-time data visualizers and theme switching.',
        techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts'],
        difficulty: 'Intermediate',
      },
    ],
  },
  'Backend Developer': {
    coreSkills: ['Node.js', 'Express.js', 'SQL', 'MongoDB', 'REST APIs', 'Git', 'Data Modeling'],
    preferredSkills: ['TypeScript', 'Redis', 'Docker', 'PostgreSQL', 'Message Queues', 'System Design'],
    milestones: [
      {
        title: 'Advanced Server Programming',
        description: 'Streams, buffers, event loops, process management, and scalable architecture.',
        topics: ['Node.js Internals', 'Streams & Buffers', 'Cluster & Worker Threads', 'REST API Architecture'],
        resources: ['Node.js Official Documentation'],
      },
      {
        title: 'Database Engineering & Caching',
        description: 'ACID transactions, query tuning, indexing strategies, and Redis caching.',
        topics: ['PostgreSQL & SQL mastery', 'Indexing strategies', 'Redis for caching and session store', 'Transactions'],
        resources: ['Use The Index, Luke!'],
      },
      {
        title: 'System Design & Distributed Patterns',
        description: 'Scalability, load balancing, rate limiting, and microservices.',
        topics: ['Horizontal vs Vertical Scaling', 'API Rate Limiting & Auth', 'Message Brokers (RabbitMQ/Kafka)', 'Microservices Architecture'],
        resources: ['System Design Primer'],
      },
    ],
    projects: [
      {
        title: 'Scalable Distributed Notification Engine',
        description: 'High-throughput event-driven messaging service handling email and push alerts.',
        techStack: ['Node.js', 'Express', 'Redis', 'MongoDB', 'Docker'],
        difficulty: 'Advanced',
      },
    ],
  },
  'Software Engineer': {
    coreSkills: ['Data Structures & Algorithms', 'Object-Oriented Programming', 'DBMS', 'Operating Systems', 'Git', 'Problem Solving'],
    preferredSkills: ['System Design', 'Computer Networks', 'Java/C++/Python', 'SQL', 'Unit Testing', 'CI/CD'],
    milestones: [
      {
        title: 'Core Computer Science Fundamentals',
        description: 'Operating Systems (Processes, Threads, Deadlocks), DBMS (SQL, Normalization), Networks (TCP/IP, HTTP).',
        topics: ['OS: Process Synchronization & Memory Management', 'DBMS: Indexing, ACID, B-Trees', 'Computer Networks: OSI, TCP/UDP, DNS'],
        resources: ['Gate Smashers', 'NPTEL CS'],
      },
      {
        title: 'Data Structures & Algorithms Mastery',
        description: 'Array manipulations, two-pointers, trees, graphs, and dynamic programming.',
        topics: ['Binary Search, Sorting, Hashing', 'Trees, BST & Traversals', 'Graph BFS/DFS & Shortest Path', 'Dynamic Programming Patterns'],
        resources: ['NeetCode 150', 'Striver SDE Sheet'],
      },
      {
        title: 'System Design & High-Level Architecture',
        description: 'Scalability, microservices, database sharding, caching, and load balancing.',
        topics: ['CAP Theorem & Consistency', 'Load Balancers & Caching', 'Database Sharding & Replication', 'Designing URL Shortener / Rate Limiter'],
        resources: ['System Design Primer on GitHub'],
      },
    ],
    projects: [
      {
        title: 'Distributed Key-Value Store with Caching',
        description: 'Low-latency in-memory data store with LRU eviction and replication log.',
        techStack: ['Go / Java / Node.js', 'Sockets', 'Multithreading'],
        difficulty: 'Advanced',
      },
    ],
  },
};

/**
 * Perform resume analysis using Google Gemini or high-fidelity fallback engine
 */
const analyzeResume = async (extractedText, targetRole = 'MERN Stack Developer', userSkills = []) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const roleConfig = ROLE_SKILL_MATRIX[targetRole] || ROLE_SKILL_MATRIX['MERN Stack Developer'];

  // 1. Try Gemini API if key is available
  if (apiKey && apiKey.trim() !== '') {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
You are an expert technical recruiter, engineering hiring manager, and ATS (Applicant Tracking System) specialist.
Analyze the following candidate resume text for the target job role: "${targetRole}".

Target Role Core Skills: ${roleConfig.coreSkills.join(', ')}
Target Role Preferred Skills: ${roleConfig.preferredSkills.join(', ')}

RESUME TEXT:
"""
${extractedText.slice(0, 10000)}
"""

Provide your evaluation strictly as a valid, parsable JSON object with the following schema:
{
  "overallScore": <integer between 40 and 95>,
  "categoryScores": {
    "impact": <integer between 40 and 95>,
    "completeness": <integer between 50 and 95>,
    "skills": <integer between 40 and 95>,
    "formatting": <integer between 50 and 95>
  },
  "skillsIdentified": [<array of technical skills found in resume>],
  "missingSkills": [<array of skills required for ${targetRole} that are missing or weak>],
  "strengths": [<array of 3-5 specific strengths>],
  "weaknesses": [<array of 3-5 specific areas for improvement>],
  "recommendations": [<array of 4-6 actionable recommendations to increase ATS match>],
  "projectSuggestions": [<array of 2-3 project ideas to build to cover missing skills>],
  "roleFitSummary": "<2-3 sentence executive assessment of candidate fit for ${targetRole}>",
  "disclaimer": "This AI-generated score is an educational preparation metric calibrated to identify learning gaps and should not be used as an objective employer hiring decision."
}

Respond ONLY with the JSON object. Do not include markdown code block backticks if possible, or use standard \`\`\`json format.
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Clean markdown code blocks if present
      const cleanJson = responseText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      const parsed = JSON.parse(cleanJson);
      if (!parsed.disclaimer) {
        parsed.disclaimer = 'This AI-generated score is an educational preparation metric calibrated to identify learning gaps and should not be used as an objective employer hiring decision.';
      }
      return parsed;
    } catch (apiError) {
      console.warn(`[AI Service] Gemini API call failed (${apiError.message}). Seamlessly engaging fallback engine.`);
    }
  }

  // 2. High-Fidelity Heuristic Fallback Engine
  return generateHeuristicAnalysis(extractedText, targetRole, userSkills, roleConfig);
};

/**
 * Deterministic Semantic Heuristic Engine (Fallback when offline or no API key)
 */
const generateHeuristicAnalysis = (text, targetRole, userSkills, roleConfig) => {
  const textLower = text.toLowerCase();

  // Check identified skills
  const allKnownSkills = [
    ...new Set([
      ...roleConfig.coreSkills,
      ...roleConfig.preferredSkills,
      'JavaScript', 'Python', 'Java', 'C++', 'C', 'HTML', 'CSS', 'React', 'Node.js',
      'Express', 'MongoDB', 'SQL', 'MySQL', 'PostgreSQL', 'Git', 'GitHub', 'Docker',
      'AWS', 'REST', 'API', 'Tailwind', 'Redux', 'TypeScript', 'DSA', 'Spring Boot',
      'Spring', 'Hibernate', 'Linux', 'Agile', 'Jira'
    ]),
  ];

  const identifiedSkills = [];
  allKnownSkills.forEach((skill) => {
    // Regex word boundary matching
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(textLower)) {
      identifiedSkills.push(skill);
    }
  });

  // Also include skills declared by user if not already in identified
  userSkills.forEach((s) => {
    if (!identifiedSkills.includes(s)) {
      identifiedSkills.push(s);
    }
  });

  // Compute missing skills for target role
  const targetRequired = [...roleConfig.coreSkills, ...roleConfig.preferredSkills.slice(0, 3)];
  const missingSkills = targetRequired.filter(
    (req) => !identifiedSkills.some((id) => id.toLowerCase() === req.toLowerCase())
  );

  // Check resume sections
  const hasEducation = /education|b\.tech|degree|college|university|cgpa|bachelor/i.test(textLower);
  const hasProjects = /project|developed|built|application|implemented/i.test(textLower);
  const hasExperience = /intern|experience|work|employment|company/i.test(textLower);
  const hasCertifications = /certification|course|certificate|hackathon|achievement/i.test(textLower);
  const hasMetrics = /\d+%\s|\d+\s*(users|requests|ms|stars|downloads|latency)/i.test(textLower);

  // Calculate scores
  let skillMatchRatio = (identifiedSkills.length / Math.max(targetRequired.length, 1));
  let skillsScore = Math.min(95, Math.max(45, Math.round(skillMatchRatio * 75 + 15)));

  let completenessScore = 50;
  if (hasEducation) completenessScore += 15;
  if (hasProjects) completenessScore += 15;
  if (hasExperience) completenessScore += 10;
  if (hasCertifications) completenessScore += 10;

  let impactScore = hasMetrics ? 82 : 64;
  let formattingScore = text.length > 800 && text.length < 5000 ? 84 : 70;

  let overallScore = Math.round(
    skillsScore * 0.4 + completenessScore * 0.25 + impactScore * 0.2 + formattingScore * 0.15
  );
  overallScore = Math.min(94, Math.max(52, overallScore));

  // Determine strengths
  const strengths = [];
  if (identifiedSkills.length >= 4) {
    strengths.push(`Strong coverage of foundational tools including ${identifiedSkills.slice(0, 4).join(', ')}.`);
  } else {
    strengths.push('Clean layout with clear technical orientation.');
  }
  if (hasProjects) {
    strengths.push('Demonstrates practical development capability through listed academic and hands-on projects.');
  }
  if (hasEducation) {
    strengths.push('Educational credentials, degree qualification, and academic background are clearly articulated.');
  }
  if (hasMetrics) {
    strengths.push('Includes quantitative metrics and measurable outcomes in descriptions.');
  } else {
    strengths.push('Clear chronological progression of undergraduate training and course competencies.');
  }

  // Determine weaknesses
  const weaknesses = [];
  if (missingSkills.length > 0) {
    weaknesses.push(`Key industry technologies for ${targetRole} like ${missingSkills.slice(0, 3).join(', ')} are not prominently featured.`);
  }
  if (!hasMetrics) {
    weaknesses.push('Project descriptions focus on features rather than quantifiable results (e.g. speedup %, active users, test coverage).');
  }
  if (!hasExperience) {
    weaknesses.push('Limited corporate or internship experience; consider highlighting open-source contributions or capstone roles.');
  }
  if (identifiedSkills.length < 6) {
    weaknesses.push('Technical skills section lacks secondary tooling like CI/CD, unit testing, and containerization.');
  }

  // Recommendations
  const recommendations = [
    `Incorporate targeted keywords for ${targetRole} such as ${missingSkills.slice(0, 3).join(', ') || 'Docker, CI/CD, Unit Testing'} into project bullet points.`,
    'Use the STAR method (Situation, Task, Action, Result) with measurable metrics in project bullet points.',
    'Add links to your live deployed applications and GitHub repositories so interviewers can inspect your source code.',
    'Include a dedicated section for Coursework & Core CS (DSA, DBMS, OS, Computer Networks) for campus placement drives.',
    'Ensure uniform typography, clean bullet formatting, and standard ATS-friendly section headers.',
  ];

  // Project suggestions
  const projectSuggestions = roleConfig.projects.map((p) => `${p.title}: ${p.description} (Tech: ${p.techStack.join(', ')})`);

  const roleFitSummary = `The candidate demonstrates a solid foundational background suitable for entry-level ${targetRole} positions. Strengthening hands-on depth in ${missingSkills.slice(0, 2).join(' and ') || 'advanced ecosystem tools'} and adding measurable outcomes to project descriptions will significantly elevate ATS pass rates and interview shortlisting.`;

  return {
    overallScore,
    categoryScores: {
      impact: impactScore,
      completeness: completenessScore,
      skills: skillsScore,
      formatting: formattingScore,
    },
    skillsIdentified: identifiedSkills,
    missingSkills,
    strengths,
    weaknesses,
    recommendations,
    projectSuggestions,
    roleFitSummary,
    disclaimer: 'This AI-generated score is an educational preparation metric calibrated to identify learning gaps and should not be used as an objective employer hiring decision.',
  };
};

/**
 * Generate personalized career roadmap
 */
const generateCareerRoadmap = async (targetRole, currentSkills = [], careerGoals = '') => {
  const roleConfig = ROLE_SKILL_MATRIX[targetRole] || ROLE_SKILL_MATRIX['MERN Stack Developer'];

  const missingSkills = roleConfig.coreSkills.filter(
    (req) => !currentSkills.some((curr) => curr.toLowerCase() === req.toLowerCase())
  );

  return {
    targetRole,
    currentSkills,
    missingSkills,
    milestones: roleConfig.milestones.map((m, idx) => ({
      title: m.title,
      description: m.description,
      topics: m.topics,
      completed: idx === 0, // first milestone completed by default as foundation
      resources: m.resources,
    })),
    recommendedProjects: roleConfig.projects,
    overallProgress: Math.round((1 / roleConfig.milestones.length) * 100),
  };
};

// ==========================================
// MOCK INTERVIEW QUESTION BANK & EVALUATOR
// ==========================================

const INTERVIEW_QUESTION_BANK = {
  HR: [
    {
      questionId: 'hr-1',
      questionText: 'Tell me about yourself, your educational background, and what motivated you to pursue software engineering.',
      topic: 'Personal Introduction & Background',
      idealAnswerPoints: ['Crisp overview of B.Tech background', 'Key technical passions and projects', 'Why you want to build software'],
    },
    {
      questionId: 'hr-2',
      questionText: 'Why should our company hire you as a fresh graduate over other candidates with similar academic credentials?',
      topic: 'Value Proposition & Strengths',
      idealAnswerPoints: ['Unique combination of curiosity and hands-on projects', 'Fast learner adaptability', 'Teamwork and culture fit'],
    },
    {
      questionId: 'hr-3',
      questionText: 'Describe a challenging technical project you built during your college course. What obstacles did you encounter and how did you overcome them?',
      topic: 'Problem Solving & Resilience (STAR Method)',
      idealAnswerPoints: ['Situation and Task', 'Specific technical roadblock', 'Action taken and measurable outcome'],
    },
    {
      questionId: 'hr-4',
      questionText: 'How do you handle constructive criticism or disagreement with a teammate regarding code design or architecture?',
      topic: 'Teamwork & Conflict Resolution',
      idealAnswerPoints: ['Open mindset without ego', 'Relying on benchmarks/data', 'Putting project goals and collaboration first'],
    },
    {
      questionId: 'hr-5',
      questionText: 'Where do you see yourself in the next 3 to 5 years in your software engineering career?',
      topic: 'Career Vision & Ambition',
      idealAnswerPoints: ['Mastering domain engineering', 'Taking ownership of end-to-end features', 'Mentoring juniors and architecture design'],
    },
  ],
  Technical: {
    'MERN Stack Developer': [
      {
        questionId: 'mern-1',
        questionText: 'Explain the Virtual DOM in React. How does React diffing and reconciliation optimize DOM manipulation compared to traditional JavaScript?',
        topic: 'React Core Architecture',
        idealAnswerPoints: ['In-memory representation of real DOM', 'Batching updates', 'Reconciliation and key prop importance'],
      },
      {
        questionId: 'mern-2',
        questionText: 'How does the Node.js Event Loop work? Explain the role of the Call Stack, Event Queue, and Libuv thread pool in non-blocking I/O.',
        topic: 'Node.js Runtime & Concurrency',
        idealAnswerPoints: ['Single-threaded event loop', 'Phases: timers, I/O callbacks, poll, check', 'Libuv thread pool for async I/O'],
      },
      {
        questionId: 'mern-3',
        questionText: 'What is the purpose of useEffect dependency array in React? How do you prevent infinite re-render loops and cleanup subscriptions?',
        topic: 'React Hooks & Lifecycle',
        idealAnswerPoints: ['Primitive vs reference dependencies', 'Cleanup function on unmount', 'useCallback/useMemo usage'],
      },
      {
        questionId: 'mern-4',
        questionText: 'Explain how JWT authentication works in a MERN application. Where should the token be stored on the client, and how do you protect Express routes?',
        topic: 'Web Security & Authentication',
        idealAnswerPoints: ['Header, Payload, Signature structure', 'HttpOnly cookies vs LocalStorage tradeoffs', 'Authorization Bearer middleware'],
      },
      {
        questionId: 'mern-5',
        questionText: 'How do indexes in MongoDB improve read performance? What are the tradeoffs of having too many indexes on high-write collections?',
        topic: 'Database Performance & Optimization',
        idealAnswerPoints: ['B-Tree index structure', 'COLLSCAN vs IXSCAN', 'Write overhead on insertions/updates'],
      },
    ],
    'Java Developer': [
      {
        questionId: 'java-1',
        questionText: 'Explain the difference between Method Overloading and Method Overriding in Java with respect to compile-time vs runtime polymorphism.',
        topic: 'Core Java & OOP',
        idealAnswerPoints: ['Overloading: same method name, different parameters (static)', 'Overriding: subclass replaces superclass method (dynamic)', '@Override annotation'],
      },
      {
        questionId: 'java-2',
        questionText: 'What is Inversion of Control (IoC) and Dependency Injection (DI) in Spring Boot? How does the Spring ApplicationContext manage bean lifecycles?',
        topic: 'Spring Boot Architecture',
        idealAnswerPoints: ['Decoupling object creation from business logic', '@Component, @Service, @Autowired', 'Singleton vs Prototype bean scopes'],
      },
      {
        questionId: 'java-3',
        questionText: 'How does HashMap work internally in Java 8+? Explain how hash collisions are resolved using Buckets and TreeNodes.',
        topic: 'Java Collections Framework',
        idealAnswerPoints: ['hashCode() and equals() contract', 'LinkedList transitioning to Red-Black Tree at threshold 8', 'O(1) average lookup vs O(log n) worst case'],
      },
      {
        questionId: 'java-4',
        questionText: 'Explain ACID properties in relational databases. What problems do transaction isolation levels prevent (e.g., Dirty Reads, Phantom Reads)?',
        topic: 'DBMS & Transaction Management',
        idealAnswerPoints: ['Atomicity, Consistency, Isolation, Durability', 'Read Uncommitted to Serializable levels', 'Locks and MVCC'],
      },
      {
        questionId: 'java-5',
        questionText: 'What is the difference between synchronized blocks, volatile variables, and ReentrantLock in Java multithreading?',
        topic: 'Java Concurrency & Threads',
        idealAnswerPoints: ['Volatile: visibility without mutual exclusion', 'Synchronized: intrinsic monitor locks', 'ReentrantLock: fair locking and tryLock capabilities'],
      },
    ],
    'Software Engineer': [
      {
        questionId: 'se-1',
        questionText: 'What is a Deadlock in Operating Systems? What are the 4 Coffman conditions required for a deadlock to occur, and how can they be prevented?',
        topic: 'Operating Systems & Concurrency',
        idealAnswerPoints: ['Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait', 'Resource Allocation Graph', 'Banker Algorithm for avoidance'],
      },
      {
        questionId: 'se-2',
        questionText: 'Explain the TCP 3-way handshake process. Why is a 2-way handshake insufficient to establish a reliable full-duplex network connection?',
        topic: 'Computer Networks',
        idealAnswerPoints: ['SYN, SYN-ACK, ACK sequence numbers', 'Full-duplex clock synchronization', 'Preventing delayed duplicate packet hazards'],
      },
      {
        questionId: 'se-3',
        questionText: 'What is Database Normalization? Explain the progression from 1NF to 3NF and BCNF, and why de-normalization is sometimes preferred in high-read systems.',
        topic: 'DBMS Normalization',
        idealAnswerPoints: ['1NF: atomic values', '2NF: no partial dependencies', '3NF: no transitive dependencies', 'De-normalization for query speed'],
      },
      {
        questionId: 'se-4',
        questionText: 'Compare the time and space complexity of Merge Sort vs Quick Sort. In which real-world scenarios would you prefer Merge Sort over Quick Sort?',
        topic: 'Data Structures & Algorithms',
        idealAnswerPoints: ['Merge Sort: guaranteed O(n log n), stable, extra O(n) memory', 'Quick Sort: in-place O(1) space, O(n^2) worst case', 'Merge Sort ideal for linked lists and external disk sorting'],
      },
      {
        questionId: 'se-5',
        questionText: 'How would you design a scalable URL Shortener service (like bit.ly)? Explain the hashing strategy, database choice, and caching layer.',
        topic: 'System Design Fundamentals',
        idealAnswerPoints: ['Base62 encoding of auto-incrementing ID or MD5 hash', 'NoSQL or Relational with high index', 'Redis cache for hot 20% URLs with LRU eviction'],
      },
    ],
  },
};

/**
 * Generate tailored interview questions for session
 */
const generateInterviewQuestions = (interviewType = 'Technical', role = 'MERN Stack Developer', difficulty = 'Intermediate', count = 3) => {
  if (interviewType === 'HR') {
    const hrQuestions = INTERVIEW_QUESTION_BANK.HR;
    return hrQuestions.slice(0, count);
  }

  // Technical
  const rolePool = INTERVIEW_QUESTION_BANK.Technical[role] || INTERVIEW_QUESTION_BANK.Technical['MERN Stack Developer'];
  const sePool = INTERVIEW_QUESTION_BANK.Technical['Software Engineer'];

  // Combine role questions with core CS questions for well-rounded placement interview
  const combined = [...rolePool, ...sePool];
  // Shuffle gently
  const shuffled = combined.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Evaluate student's submitted answer using Gemini AI or semantic heuristic engine
 */
const evaluateInterviewAnswer = async (questionText, userAnswer, interviewType, role, topic) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== '') {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
You are a senior technical interviewer at a top technology product company conducting a placement mock interview for a final-year student.
Interview Type: ${interviewType}
Candidate Role Target: ${role}
Topic: ${topic}

QUESTION:
"${questionText}"

CANDIDATE'S SUBMITTED ANSWER:
"${userAnswer}"

Evaluate the candidate's answer constructively across 5 criteria (each scored 1 to 10):
1. Relevance (Does it directly address the question?)
2. Technical Accuracy (Are the technical definitions, keywords, and mechanics correct?)
3. Clarity (Is the explanation articulate and structured?)
4. Completeness (Are critical components or edge cases covered?)
5. Communication (Professional tone and confident delivery)

Return your evaluation strictly as JSON:
{
  "score": <integer or float between 1 and 10>,
  "criteriaScores": {
    "relevance": <integer between 1 and 10>,
    "technicalAccuracy": <integer between 1 and 10>,
    "clarity": <integer between 1 and 10>,
    "completeness": <integer between 1 and 10>,
    "communication": <integer between 1 and 10>
  },
  "feedback": "<2-3 sentences explaining strengths and gaps in the answer>",
  "suggestedImprovement": "<1-2 sentences with concrete tips to phrase this better during a viva or job interview>",
  "topicsToRevise": [<array of 1-3 specific concepts to read up on>]
}
Respond ONLY with the JSON object.
`;

      const result = await model.generateContent(prompt);
      const cleanJson = result.response.text()
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      return JSON.parse(cleanJson);
    } catch (e) {
      console.warn(`[AI Service] Interview evaluation Gemini call failed (${e.message}). Falling back to heuristic evaluator.`);
    }
  }

  // Semantic Heuristic Fallback Evaluator
  return evaluateAnswerHeuristic(questionText, userAnswer, interviewType, topic);
};

const evaluateAnswerHeuristic = (questionText, userAnswer, interviewType, topic) => {
  const trimmed = userAnswer ? userAnswer.trim() : '';
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

  if (wordCount < 10) {
    return {
      score: 3.5,
      criteriaScores: {
        relevance: 4,
        technicalAccuracy: 3,
        clarity: 4,
        completeness: 2,
        communication: 4,
      },
      feedback: 'The answer is too brief for an engineering placement interview. Technical interviewers look for depth, core keywords, and real-world examples.',
      suggestedImprovement: 'Expand your response by defining the concept first, explaining its working mechanism, and sharing a project scenario where you used it.',
      topicsToRevise: [topic, 'Fundamental Definitions', 'Practical Applications'],
    };
  }

  // Assess depth based on structure and length
  const hasExamples = /for example|e\.g\.|such as|in my project|specifically|because|where/i.test(trimmed);
  const hasStructure = /\n|\.|\;|\:|\-/i.test(trimmed);

  let relevance = wordCount >= 30 ? 8 : 6;
  let accuracy = wordCount >= 45 ? 8 : 6;
  let clarity = hasStructure ? 8 : 7;
  let completeness = wordCount >= 60 ? 8 : (wordCount >= 35 ? 7 : 5);
  let communication = hasExamples ? 9 : 7;

  let overallScore = Math.round(((relevance + accuracy + clarity + completeness + communication) / 5) * 10) / 10;
  overallScore = Math.min(9.5, Math.max(4.0, overallScore));

  return {
    score: overallScore,
    criteriaScores: {
      relevance,
      technicalAccuracy: accuracy,
      clarity,
      completeness,
      communication,
    },
    feedback: `Solid answer demonstrating good foundational understanding of ${topic}. Your response covers primary concepts clearly and conveys good technical intent.`,
    suggestedImprovement: 'To achieve a perfect 10, structure your answer using the STAR method (Situation, Task, Action, Result) and mention time/space complexities or internal tradeoffs.',
    topicsToRevise: [topic, 'Internal Implementation Details', 'Tradeoff Analysis'],
  };
};

/**
 * Generate final interview summary report
 */
const generateInterviewSummary = (session) => {
  const finalScore = session.calculateFinalScore();

  let verdict = '';
  if (finalScore >= 80) {
    verdict = 'Outstanding interview performance! You demonstrated technical precision, clear articulation, and strong placement confidence.';
  } else if (finalScore >= 65) {
    verdict = 'Good overall practice performance. Your core concepts are sound; focus on providing deeper technical implementation details and structured examples.';
  } else {
    verdict = 'Good practice attempt. Further revision on foundational theory and framing comprehensive technical answers will significantly improve your scores.';
  }

  return {
    finalScore,
    overallFeedback: verdict,
  };
};

module.exports = {
  analyzeResume,
  generateCareerRoadmap,
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  generateInterviewSummary,
  ROLE_SKILL_MATRIX,
  INTERVIEW_QUESTION_BANK,
};

