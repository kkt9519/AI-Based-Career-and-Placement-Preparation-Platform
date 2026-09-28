import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI, resumeAPI } from '../services/api';
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
  Clock,
  Layers,
  Award,
  AlertCircle,
  BarChart3,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';
import ResumeUploadCard from '../components/ResumeUploadCard';

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const loadDashboardData = async () => {
    try {
      const [dashRes, resumesRes] = await Promise.all([
        userAPI.getDashboardStats(),
        resumeAPI.getResumes(),
      ]);

      if (dashRes.data.success) {
        setStats(dashRes.data.stats);
      }
      if (resumesRes.data.success) {
        setResumes(resumesRes.data.resumes);
      }
    } catch (err) {
      setErrorMsg('Failed to load live dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleUploadSuccess = () => {
    loadDashboardData();
  };

  const handleResumeDeleted = () => {
    loadDashboardData();
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Gathering placement preparation stats..." />;
  }

  const completion = stats?.profileCompletion ?? (user?.profileCompletion || 0);

  // Preparation readiness metrics for Recharts
  const readinessChartData = [
    { name: 'Profile', score: completion, fullMark: 100 },
    {
      name: 'Resume',
      score: stats?.resumeScore ?? (resumes.length > 0 ? 60 : 0),
      fullMark: 100,
    },
    {
      name: 'Aptitude',
      score: stats?.totalAssessments > 0 ? stats.avgAssessmentScore : 0,
      fullMark: 100,
    },
    {
      name: 'Interview',
      score: stats?.totalInterviews > 0 ? stats.avgInterviewScore : 0,
      fullMark: 100,
    },
    {
      name: 'Skills',
      score: Math.min(100, (stats?.skills?.length || 0) * 15),
      fullMark: 100,
    },
  ];

  const quickActions = [
    {
      title: 'AI Resume Analyzer',
      desc: 'Scan your resume against target job keywords with Gemini AI.',
      icon: FileText,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Gemini AI',
      to: '/resume-analyzer',
    },
    {
      title: 'Career Roadmap',
      desc: 'Track completed milestones and identify missing skill gaps.',
      icon: Map,
      color: 'from-amber-500 to-orange-600',
      badge: 'Role Guidance',
      to: '/career-roadmap',
    },
    {
      title: 'AI Mock Interview',
      desc: 'Simulate Technical & HR interviews with instant scoring.',
      icon: Bot,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Live Simulator',
      to: '/mock-interview',
    },
    {
      title: 'Aptitude & Coding Practice',
      desc: 'Take timed tests on Quants, Logical Reasoning, and CS subjects.',
      icon: Brain,
      color: 'from-purple-500 to-pink-600',
      badge: 'Timed Quiz',
      to: '/assessments',
    },
    {
      title: 'Jobs & Internships',
      desc: 'Explore job listings with automatic skill-matching % calculation.',
      icon: Briefcase,
      color: 'from-sky-500 to-blue-600',
      badge: 'Skill Match',
      to: '/jobs',
    },
    {
      title: 'Student Profile',
      desc: 'Update college details, GPA, GitHub, and technical skills.',
      icon: User,
      color: 'from-slate-600 to-slate-800',
      badge: 'Settings',
      to: '/profile',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white">
              <Sparkles className="w-3.5 h-3.5" /> Placement Season 2026 Preparation
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome to CareerPilot AI! 👋
            </h1>
            <p className="text-sm text-indigo-100">
              Target Career Role:{' '}
              <span className="font-semibold text-white">
                {stats?.targetRole || user?.targetRole || 'Software Engineer'}
              </span>
              . Real-time metrics aggregated directly from your practice records.
            </p>
          </div>

          {/* Profile Completion Widget */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col items-center justify-center min-w-[190px]">
            <span className="text-xs uppercase tracking-wider text-indigo-100 font-semibold">
              Profile Readiness
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
              Edit Profile Details →
            </Link>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Resume Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Resume ATS Score
            </span>
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.resumeScore ? `${stats.resumeScore}/100` : resumes.length > 0 ? 'Uploaded' : 'No Resume'}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {resumes.length > 0
                ? `${resumes.length} resume(s) on file`
                : 'Upload your resume below to analyze'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/resume-analyzer"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              Analyze with Gemini AI →
            </Link>
          </div>
        </div>

        {/* Card 2: Assessments Attempted */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Aptitude Practice
            </span>
            <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Brain className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.totalAssessments || 0}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {stats?.totalAssessments > 0
                ? `Avg Score: ${stats.avgAssessmentScore}%`
                : 'No tests attempted yet'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/assessments"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              Start Aptitude Test →
            </Link>
          </div>
        </div>

        {/* Card 3: Mock Interviews */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Mock Interviews
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Bot className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.totalInterviews || 0}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {stats?.totalInterviews > 0
                ? `Avg Rating: ${stats.avgInterviewScore}/10`
                : 'No mock sessions yet'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/mock-interview"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              Begin AI Interview →
            </Link>
          </div>
        </div>

        {/* Card 4: Technical Skills */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Verified Skills
            </span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.skills?.length || 0} Skills
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
              {stats?.skills?.slice(0, 3).join(', ') || 'No skills added'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/profile"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              Manage Skills Tag →
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Analytics & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-600" /> Placement Readiness Index
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calculated from profile completion, resume extraction, tests, and skills
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400">
              Scale: 0 - 100
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={readinessChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: 'rgba(51, 65, 85, 0.5)',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [`${value}%`, 'Score']}
                />
                <Bar dataKey="score" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" /> Recent Activities
            </h3>
            <span className="text-[11px] text-slate-400">Live Log</span>
          </div>

          <div className="space-y-3">
            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              stats.recentActivities.slice(0, 5).map((act) => (
                <div
                  key={act.id}
                  className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                >
                  <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {act.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {act.description}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                <Clock className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                <p>No recorded activities yet.</p>
                <p className="mt-1 text-[11px] text-slate-400">Upload a resume or take a test to start logging.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resume Upload Section */}
      <ResumeUploadCard
        onUploadSuccess={handleUploadSuccess}
        currentResumes={resumes}
        onResumeDeleted={handleResumeDeleted}
      />

      {/* Quick Launchers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Placement Preparation Modules
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Launch tailored modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                to={action.to}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${action.color} text-white flex items-center justify-center shadow-md`}
                    >
                      <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
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

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400">
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
