import React, { useState, useEffect } from 'react';
import { resumeAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Sparkles,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Brain,
  Layers,
  ArrowRight,
  RefreshCw,
  Clock,
  Briefcase,
  Target,
  Code,
  FileCheck,
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ResumeUploadCard from '../components/ResumeUploadCard';

const TARGET_ROLES = [
  'MERN Stack Developer',
  'Java Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Software Engineer',
];

const ResumeAnalyzerPage = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'MERN Stack Developer');
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('analyzer'); // 'analyzer' | 'history'
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    try {
      const [resumesRes, historyRes] = await Promise.all([
        resumeAPI.getResumes(),
        resumeAPI.getAnalysisHistory(),
      ]);

      if (resumesRes.data.success) {
        setResumes(resumesRes.data.resumes);
        if (resumesRes.data.resumes.length > 0 && !selectedResumeId) {
          setSelectedResumeId(resumesRes.data.resumes[0]._id);
        }
      }

      if (historyRes.data.success) {
        setHistory(historyRes.data.analyses);
        if (historyRes.data.analyses.length > 0 && !currentAnalysis) {
          setCurrentAnalysis(historyRes.data.analyses[0]);
        }
      }
    } catch (err) {
      setErrorMsg('Failed to load resume details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAnalyze = async () => {
    if (!selectedResumeId) {
      setErrorMsg('Please select or upload a resume to analyze.');
      return;
    }

    setAnalyzing(true);
    setErrorMsg('');

    try {
      const res = await resumeAPI.analyzeResume(selectedResumeId, targetRole);
      if (res.data.success) {
        setCurrentAnalysis(res.data.analysis);
        // Refresh history
        const histRes = await resumeAPI.getAnalysisHistory();
        if (histRes.data.success) {
          setHistory(histRes.data.analyses);
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to analyze resume with AI.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400 stroke-emerald-500';
    if (score >= 65) return 'text-brand-600 dark:text-brand-400 stroke-brand-500';
    return 'text-amber-600 dark:text-amber-400 stroke-amber-500';
  };

  const getScoreBadge = (score) => {
    if (score >= 85) return { text: 'Placement Ready (Top Tier)', bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' };
    if (score >= 70) return { text: 'Strong Candidate', bg: 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300' };
    if (score >= 55) return { text: 'Moderate Match (Needs Polish)', bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' };
    return { text: 'Skill Gaps Detected', bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' };
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading AI Resume Analyzer..." />;
  }

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-brand-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Powered by Google Gemini AI
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Resume Analyzer & ATS Scorer
          </h1>
          <p className="text-sm text-blue-100 leading-relaxed">
            Extract keywords, identify role-specific skill gaps, and get actionable recommendations tailored for college placement drives.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'analyzer' ? 'bg-white text-brand-700 shadow-sm' : 'text-white hover:bg-white/10'
            }`}
          >
            Analysis Report
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'history' ? 'bg-white text-brand-700 shadow-sm' : 'text-white hover:bg-white/10'
            }`}
          >
            History ({history.length})
          </button>
        </div>
      </div>

      {/* Target Role & Resume Selection Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {/* Target Role */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Target Job Role
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 min-w-[200px]"
            >
              {TARGET_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Select Resume */}
          {resumes.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Select Uploaded Resume
              </label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 max-w-xs"
              >
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.originalName} ({new Date(r.uploadedAt || r.createdAt).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={analyzing || resumes.length === 0}
          className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 rounded-2xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all hover:scale-[1.01]"
        >
          {analyzing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Evaluating with Gemini AI...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2 text-amber-300" /> Analyze Resume with AI
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 text-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
          {selectedResumeId && (
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={analyzing}
              className="px-3.5 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/80 dark:hover:bg-red-800 text-red-700 dark:text-red-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 flex-shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
              Retry Analysis
            </button>
          )}
        </div>
      )}

      {/* Main Content Area */}
      {activeTab === 'analyzer' ? (
        currentAnalysis ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Score Summary Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Circular Score Gauge */}
                <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100 dark:text-slate-800"
                        strokeWidth="3.2"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={`${getScoreColor(currentAnalysis.overallScore)} transition-all duration-1000 stroke-current`}
                        strokeDasharray={`${currentAnalysis.overallScore}, 100`}
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-4xl font-black text-slate-900 dark:text-white">
                        {currentAnalysis.overallScore}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        out of 100
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        getScoreBadge(currentAnalysis.overallScore).bg
                      }`}
                    >
                      {getScoreBadge(currentAnalysis.overallScore).text}
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Calibrated for: <strong className="text-slate-800 dark:text-slate-200">{currentAnalysis.targetRole}</strong>
                    </p>
                  </div>
                </div>

                {/* Category Breakdown Progress Bars */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Category ATS Breakdown
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Technical Skill Relevance</span>
                        <span className="text-brand-600 dark:text-brand-400">{currentAnalysis.categoryScores?.skills || 75}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-brand-600 h-full rounded-full transition-all duration-700"
                          style={{ width: `${currentAnalysis.categoryScores?.skills || 75}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Section Completeness & Projects</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{currentAnalysis.categoryScores?.completeness || 80}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                          style={{ width: `${currentAnalysis.categoryScores?.completeness || 80}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Measurable Impact & Metrics</span>
                        <span className="text-indigo-600 dark:text-indigo-400">{currentAnalysis.categoryScores?.impact || 65}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full transition-all duration-700"
                          style={{ width: `${currentAnalysis.categoryScores?.impact || 65}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-600 dark:text-slate-400">ATS Layout & Formatting</span>
                        <span className="text-sky-600 dark:text-sky-400">{currentAnalysis.categoryScores?.formatting || 80}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-sky-500 h-full rounded-full transition-all duration-700"
                          style={{ width: `${currentAnalysis.categoryScores?.formatting || 80}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Academic Disclaimer Box */}
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2 mt-4">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Important Academic Note:</strong> {currentAnalysis.disclaimer || 'This AI-generated score is an approximate training metric intended to guide interview preparation, not an actual employer ATS hiring decision.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Role Fit Summary */}
              {currentAnalysis.roleFitSummary && (
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Executive Fit Summary
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    {currentAnalysis.roleFitSummary}
                  </p>
                </div>
              )}
            </div>

            {/* Skill Gap Analysis: Matched vs Missing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matched Skills */}
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Identified Technical Skills ({currentAnalysis.skillsIdentified?.length || 0})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentAnalysis.skillsIdentified && currentAnalysis.skillsIdentified.length > 0 ? (
                    currentAnalysis.skillsIdentified.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      >
                        ✓ {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No clear skills parsed from resume.</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <XCircle className="w-5 h-5 text-rose-500" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Missing Keywords for {currentAnalysis.targetRole}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentAnalysis.missingSkills && currentAnalysis.missingSkills.length > 0 ? (
                    currentAnalysis.missingSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                      >
                        + {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-600 font-semibold">
                      Excellent! All core requirements for this role are covered.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" /> Profile Strengths
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {currentAnalysis.strengths?.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-600" /> Areas for Improvement
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {currentAnalysis.weaknesses?.map((weak, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actionable Recommendations */}
            <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-brand-600" /> Actionable Recommendations to Boost ATS Score
              </h3>
              <div className="space-y-3">
                {currentAnalysis.recommendations?.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Projects to Bridge Skill Gaps */}
            {currentAnalysis.projectSuggestions && currentAnalysis.projectSuggestions.length > 0 && (
              <div className="p-6 sm:p-8 bg-gradient-to-br from-indigo-50 to-brand-50/40 dark:from-slate-900 dark:to-slate-800/70 border border-indigo-100 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-600" /> Recommended Projects to Bridge Missing Skills
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentAnalysis.projectSuggestions.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                    >
                      <span className="font-bold text-brand-600 dark:text-brand-400 block mb-1">
                        Project #{idx + 1}
                      </span>
                      {proj}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty state when no analysis performed yet */
          <div className="text-center py-16 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
            <FileText className="w-16 h-16 mx-auto text-brand-500 animate-bounce" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Ready for Intelligent Resume Analysis
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Select your target placement role above and click <strong>"Analyze Resume with AI"</strong> to generate your score, identified skills, and missing keyword report.
            </p>
          </div>
        )
      ) : (
        /* History Tab */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" /> Previous Resume Analyses ({history.length})
            </h3>
          </div>

          {history.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {history.map((item) => (
                <div
                  key={item._id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {item.targetRole}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          getScoreBadge(item.overallScore).bg
                        }`}
                      >
                        {item.overallScore}/100
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      File: {item.resumeId?.originalName || 'Uploaded Resume'} • Date:{' '}
                      {new Date(item.createdAt).toLocaleDateString()} at{' '}
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentAnalysis(item);
                      setActiveTab('analyzer');
                    }}
                    className="inline-flex items-center text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    View Report →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-slate-400">
              No previous analysis reports found. Upload and analyze a resume to see history.
            </div>
          )}
        </div>
      )}

      {/* Embedded Resume Upload Drawer */}
      <div className="pt-4">
        <ResumeUploadCard
          currentResumes={resumes}
          onUploadSuccess={() => loadData()}
          onResumeDeleted={() => loadData()}
        />
      </div>
    </div>
  );
};

export default ResumeAnalyzerPage;
