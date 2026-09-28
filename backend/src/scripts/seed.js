require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');
const { seedQuestions } = require('./seedQuestions');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerpilot_ai';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB for seeding data.');

    // Clear existing demo accounts
    await User.deleteMany({ email: { $in: ['admin@careerpilot.ai', 'student@careerpilot.ai'] } });

    // Seed Admin
    const admin = await User.create({
      name: 'Platform Administrator',
      email: 'admin@careerpilot.ai',
      password: 'AdminPassword123!',
      role: 'admin',
      targetRole: 'Engineering Manager',
      skills: ['System Design', 'Cloud Architecture', 'Leadership', 'Full Stack Development'],
      profile: {
        college: 'National Institute of Technology',
        degree: 'M.Tech',
        branch: 'Computer Science and Engineering',
        graduationYear: 2020,
        cgpa: 9.4,
        bio: 'Lead System Architect & Placement Administrator at CareerPilot AI.',
        location: 'Bengaluru, India',
        githubUrl: 'https://github.com/careerpilot-admin',
        linkedinUrl: 'https://linkedin.com/in/careerpilot-admin',
      },
    });

    // Seed Student
    const student = await User.create({
      name: 'Alex Chen',
      email: 'student@careerpilot.ai',
      password: 'StudentPassword123!',
      role: 'student',
      targetRole: 'MERN Stack Developer',
      careerGoals: 'Secure a Full Stack Developer role at a high-growth tech product company.',
      skills: ['JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Git', 'REST APIs'],
      profile: {
        phone: '+91 98765 43210',
        college: 'City Institute of Technology',
        degree: 'B.Tech',
        branch: 'Computer Science and Design',
        graduationYear: 2026,
        cgpa: 8.7,
        bio: 'Final year Computer Science and Design undergraduate passionate about full-stack web applications, distributed systems, and modern UI/UX design.',
        location: 'Bangalore, India',
        githubUrl: 'https://github.com/alexchen-dev',
        linkedinUrl: 'https://linkedin.com/in/alexchen-dev',
        portfolioUrl: 'https://alexchen.dev',
      },
    });

    // Clear and seed realistic placement jobs
    await Job.deleteMany({ isSampleData: true });

    const sampleJobs = [
      {
        title: 'Graduate Engineer Trainee (GET) - Developer',
        company: 'HCLTech',
        description: 'HCLTech is looking for energetic Graduate Engineer Trainees to join our Digital Engineering Practice. As a GET Developer, you will be part of agile squads developing enterprise web applications, implementing microservices, and writing clean, scalable code.',
        requiredSkills: ['Java', 'SQL', 'Data Structures & Algorithms', 'Object-Oriented Programming', 'Git'],
        preferredSkills: ['Spring Boot', 'REST APIs', 'React', 'Cloud Basics'],
        location: 'Noida, India',
        workMode: 'Hybrid',
        jobType: 'Full-time',
        experience: 'Fresher (2026 Batch)',
        salary: '₹5,50,000 - ₹7,25,000 / year',
        applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        applicationUrl: 'https://hcltech.com/careers',
        isSampleData: true,
        createdBy: admin._id,
      },
      {
        title: 'Junior MERN Stack Developer',
        company: 'Cognizant CloudWorks',
        description: 'We are seeking a Junior MERN Stack Developer with solid fundamentals in JavaScript, React.js, Node.js, and MongoDB. You will collaborate with senior architects to create high-throughput customer portals.',
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express.js', 'REST APIs'],
        preferredSkills: ['Tailwind CSS', 'Docker', 'Redux', 'TypeScript'],
        location: 'Bengaluru, India',
        workMode: 'Hybrid',
        jobType: 'Full-time',
        experience: '0-1 Years',
        salary: '₹6,50,000 - ₹8,50,000 / year',
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        applicationUrl: 'https://cognizant.com/careers',
        isSampleData: true,
        createdBy: admin._id,
      },
      {
        title: 'Frontend Engineering Intern',
        company: 'Zomato Tech',
        description: 'Join our customer experience team as a Frontend Engineering Intern. You will translate interactive Figma UI designs into lightning-fast, accessible React components with Tailwind CSS and responsive design principles.',
        requiredSkills: ['JavaScript', 'React', 'HTML5', 'CSS3', 'Tailwind CSS'],
        preferredSkills: ['Next.js', 'TypeScript', 'Framer Motion', 'Jest'],
        location: 'Gurugram, India',
        workMode: 'Onsite',
        jobType: 'Internship',
        experience: 'College Final-Year Intern',
        salary: '₹40,000 / month Stipend',
        applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        applicationUrl: 'https://zomato.com/careers',
        isSampleData: true,
        createdBy: admin._id,
      },
      {
        title: 'Associate Java Developer',
        company: 'Infosys FinTech',
        description: 'Design and deploy robust backend financial microservices using Core Java, Spring Boot, Hibernate, and relational databases. Strong focus on transaction safety, unit testing, and REST standards.',
        requiredSkills: ['Java', 'Spring Boot', 'SQL', 'DBMS', 'Git'],
        preferredSkills: ['Hibernate', 'Microservices', 'Docker', 'JUnit'],
        location: 'Hyderabad, India',
        workMode: 'Hybrid',
        jobType: 'Full-time',
        experience: 'Fresher / 0-1 Years',
        salary: '₹6,00,000 - ₹8,00,000 / year',
        applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        applicationUrl: 'https://infosys.com/careers',
        isSampleData: true,
        createdBy: admin._id,
      },
      {
        title: 'Full Stack Engineering Intern',
        company: 'Razorpay Payments',
        description: 'Work directly on high-scale merchant checkout flows and payment integration dashboards. Hands-on exposure to Node.js, React, Redis, and high-concurrency payment gateway infrastructure.',
        requiredSkills: ['Node.js', 'React', 'JavaScript', 'REST APIs', 'SQL'],
        preferredSkills: ['MongoDB', 'TypeScript', 'Docker', 'Redis'],
        location: 'Remote, India',
        workMode: 'Remote',
        jobType: 'Internship',
        experience: '6-Months Internship',
        salary: '₹45,000 / month Stipend',
        applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        applicationUrl: 'https://razorpay.com/jobs',
        isSampleData: true,
        createdBy: admin._id,
      },
      {
        title: 'Associate Software Engineer (Core Systems)',
        company: 'Wipro Digital',
        description: 'Entry-level position for software engineers passionate about systems programming, data structures, algorithm optimization, and enterprise database integrations.',
        requiredSkills: ['Data Structures & Algorithms', 'C++', 'Java', 'Operating Systems', 'DBMS'],
        preferredSkills: ['Computer Networks', 'Git', 'Linux', 'SQL'],
        location: 'Pune, India',
        workMode: 'Onsite',
        jobType: 'Full-time',
        experience: 'Fresher (2026 Batch)',
        salary: '₹5,00,000 - ₹7,00,000 / year',
        applicationDeadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        applicationUrl: 'https://wipro.com/careers',
        isSampleData: true,
        createdBy: admin._id,
      },
    ];

    await Job.insertMany(sampleJobs);
    await seedQuestions();

    console.log(`[Seed] Successfully seeded Admin: ${admin.email}`);
    console.log(`[Seed] Successfully seeded Student: ${student.email}`);
    console.log(`[Seed] Successfully seeded ${sampleJobs.length} placement jobs.`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`[Seed] Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
