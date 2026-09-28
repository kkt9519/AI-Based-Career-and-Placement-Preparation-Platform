import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  FileCheck,
  Bot,
  MapPin,
  Brain,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  Zap,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle background glow */}
        <div className="absolute inset-x-0 -top-20 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-brand-600 to-indigo-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Final-Year B.Tech Capstone Project & Placement Portal</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Accelerate Your Campus Placement with{' '}
          <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-300">
            Intelligent AI
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          CareerPilot AI empowers engineering students and fresh graduates to crack top tech interviews through AI resume scoring, role-specific roadmaps, live AI mock interviews, and timed aptitude tests.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-2xl shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02]"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-2xl shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02]"
              >
                Start Preparation Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl shadow-sm transition-all"
              >
                Sign In with Demo Accounts
              </Link>
            </>
          )}
        </div>

        {/* Quick Demo Credentials Pill */}
        <div className="mt-8 p-3 max-w-xl mx-auto rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row items-center justify-center gap-3">
          <span className="font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Instant Demo:
          </span>
          <span><strong>Student:</strong> student@careerpilot.ai / StudentPassword123!</span>
          <span className="hidden sm:inline">|</span>
          <span><strong>Admin:</strong> admin@careerpilot.ai / AdminPassword123!</span>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="modules" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2">
            Integrated Placement Preparation Suite
          </h2>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Everything You Need to Get Hired
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              AI Resume Analyzer
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Upload PDF or DOCX resumes. The Gemini engine extracts text, computes completeness, scans technical keywords, and provides actionable recommendations tailored to your target job role.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              AI Mock Interview Simulator
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Practice real Technical and HR interviews. Answer questions step-by-step and receive immediate AI critique on technical accuracy, clarity, and communication with overall scoring.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Personalized Career Roadmaps
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Customized learning paths for Java Developer, MERN Developer, Frontend, and Backend. Check off completed topics and identify missing skill gaps to boost your placement readiness.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Aptitude & Coding Practice
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Quantitative, Logical, Verbal, and CS core subjects multiple-choice tests with countdown timers, immediate explanations, and category-wise performance analytics.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Job & Internship Portal
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Curated tech opportunities with transparent skill-match scoring comparing candidate skills against job requirements, bookmarking, and application progress tracking.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Admin & Analytics Console
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Role-protected administrator portal to manage student accounts, job listings, question banks, and monitor real-time platform engagement metrics.
            </p>
          </div>
        </div>
      </section>

      {/* Academic Viva Showcase Callout */}
      <section id="viva" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-brand-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden shadow-2xl border border-brand-800/50">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-800/80 text-brand-200 border border-brand-700">
              <GraduationCap className="w-4 h-4" /> Final-Year B.Tech Project
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Built for Technical Viva & Industry Demonstration
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Designed with enterprise architecture principles: stateless JWT authentication with bcrypt password encryption, MongoDB indexing, Zod input validation schemas, Multer document parsing, Jest integration testing suite, and AI prompt engineering with graceful local fallbacks.
            </p>
            <div className="pt-4 flex flex-wrap gap-4 text-xs sm:text-sm font-medium text-slate-200">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Full MERN Stack</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Google Gemini AI</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Jest / Supertest Automated Tests</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Role-Based Access Control</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
