import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  FileText,
  Map,
  Briefcase,
  Bot,
  Brain,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  User,
  Shield,
  Layers,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();

  const completion = user?.profileCompletion || 0;

  const quickActions = [
    {
      title: 'AI Resume Analyzer',
      desc: 'Upload PDF/DOCX and receive instant Gemini-powered feedback and score.',
      icon: FileText,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Gemini AI',
      to: '/resume-analyzer',
    },
    {
      title: 'Career Roadmap',
      desc: 'Track milestones and skill gaps for your chosen target job role.',
      icon: Map,
      color: 'from-amber-500 to-orange-600',
      badge: 'Role Guidance',
      to: '/career-roadmap',
    },
    {
      title: 'AI Mock Interview',
      desc: 'Simulate Technical & HR interviews with real-time answer critique.',
      icon: Bot,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Interactive',
      to: '/mock-interview',
    },
    {
      title: 'Aptitude & Coding Practice',
      desc: 'Practice timed Quants, Logical Reasoning, and CS core MCQs.',
      icon: Brain,
      color: 'from-purple-500 to-pink-600',
      badge: 'Timed Quiz',
      to: '/assessments',
    },
    {
      title: 'Jobs & Internships',
      desc: 'Explore curated job listings with automatic skill-matching % calculation.',
      icon: Briefcase,
      color: 'from-sky-500 to-blue-600',
      badge: 'Skill Match',
      to: '/jobs',
    },
    {
      title: 'Student Profile',
      desc: 'Update your education, college details, GitHub, and technical skills.',
      icon: User,
      color: 'from-slate-600 to-slate-800',
      badge: 'Settings',
      to: '/profile',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white">
              <Sparkles className="w-3.5 h-3.5" /> Placement Season 2026 Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-sm text-indigo-100">
              Targeting: <span className="font-semibold text-white">{user?.targetRole || 'Software Engineer'}</span>. Complete your modules to maximize your placement readiness.
            </p>
          </div>

          {/* Profile Completion Widget */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col items-center justify-center min-w-[180px]">
            <span className="text-xs uppercase tracking-wider text-indigo-100 font-semibold">
              Profile Completion
            </span>
            <div className="text-3xl font-black mt-1 mb-1">{completion}%</div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${completion}%` }}
              />
            </div>
            <Link
              to="/profile"
              className="mt-3 text-[11px] font-semibold text-indigo-100 hover:text-white underline"
            >
              Update Profile Details →
            </Link>
          </div>
        </div>
      </div>

      {/* Target Role & Skills Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Target Role
            </span>
            <span className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">
            {user?.targetRole || 'Software Engineer'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Roadmap and interview simulations are calibrated for this role.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Declared Skills ({user?.skills?.length || 0})
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {user?.skills && user.skills.length > 0 ? (
              user.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">No skills added yet</span>
            )}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Account Status
            </span>
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Shield className="w-4 h-4" />
            </span>
          </div>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white capitalize flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            {user?.role} (Active)
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Registered: {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Placement Preparation Modules
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Choose an activity to practice
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                to={action.to}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${action.color} text-white flex items-center justify-center shadow-md`}
                    >
                      <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {action.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {action.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400">
                  <span>Launch Module</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
