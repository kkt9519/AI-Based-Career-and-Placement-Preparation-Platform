import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  History,
  TrendingUp,
  Award,
  ChevronRight,
  BookOpen,
  MessageSquare,
  BarChart2,
} from 'lucide-react';
import { interviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MockInterviewPage() {
  const { user } = useAuth();

  // Mode: 'setup' | 'live' | 'feedback' | 'summary' | 'history'
  const [mode, setMode] = useState('setup');

  // Setup form states
  const [interviewType, setInterviewType] = useState('Technical');
  const [role, setRole] = useState(user?.targetRole || 'MERN Stack Developer');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [totalQuestions, setTotalQuestions] = useState(3);

  // Active session states
  const [activeSession, setActiveSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [lastEvaluation, setLastEvaluation] = useState(null);

  // Timer state
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // History states
  const [historyList, setHistoryList] = useState([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Start interview session
  const handleStartInterview = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await interviewAPI.startInterview({
        interviewType,
        role,
        difficulty,
        totalQuestions: parseInt(totalQuestions, 10),
      });

      if (res.data?.success) {
        const sessionData = res.data.data;
        setActiveSession(sessionData);
        setCurrentQuestion(sessionData.currentQuestion);
        setQuestionIndex(0);
        setUserAnswer('');
        setLastEvaluation(null);
        setSecondsElapsed(0);
        setIsTimerRunning(true);
        setMode('live');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start interview session.');
    } finally {
      setLoading(false);
    }
  };

  // Submit answer
  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      setError('Please provide an answer before submitting.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await interviewAPI.submitAnswer(activeSession.sessionId, {
        questionIndex,
        userAnswer,
      });

      if (res.data?.success) {
        const evalData = res.data.data;
        setLastEvaluation(evalData);
        setIsTimerRunning(false);

        if (evalData.isCompleted) {
          // Fetch final session details
          const finalRes = await interviewAPI.getById(activeSession.sessionId);
          setActiveSession(finalRes.data.data);
          setMode('summary');
        } else {
          setMode('feedback');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to evaluate answer.');
    } finally {
      setLoading(false);
    }
  };

  // Proceed to next question from feedback
  const handleNextQuestion = () => {
    if (lastEvaluation?.nextQuestion) {
      setCurrentQuestion(lastEvaluation.nextQuestion);
      setQuestionIndex(lastEvaluation.nextQuestion.index);
      setUserAnswer('');
      setLastEvaluation(null);
      setIsTimerRunning(true);
      setMode('live');
    } else {
      setMode('summary');
    }
  };

  // Finish session early
  const handleFinishEarly = async () => {
    if (!activeSession?.sessionId) return;
    setLoading(true);
    try {
      const res = await interviewAPI.finishInterview(activeSession.sessionId);
      if (res.data?.success) {
        setActiveSession(res.data.data);
        setIsTimerRunning(false);
        setMode('summary');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to finalize interview.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch past interview sessions
  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await interviewAPI.getHistory({ limit: 20 });
      if (res.data?.success) {
        setHistoryList(res.data.data);
        setMode('history');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch interview history.');
    } finally {
      setLoading(false);
    }
  };

  // View specific history session details
  const handleViewHistoryDetail = async (id) => {
    setLoading(true);
    try {
      const res = await interviewAPI.getById(id);
      if (res.data?.success) {
        setSelectedHistoryItem(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load session details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Placement Simulator
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            AI Mock Interview Studio
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Simulate realistic technical and HR interviews with instant multi-criteria AI feedback and viva preparation tips.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {mode !== 'setup' && (
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setMode('setup');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
            >
              <RotateCcw className="w-4 h-4" />
              New Session
            </button>
          )}

          {mode !== 'history' && (
            <button
              onClick={loadHistory}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition"
            >
              <History className="w-4 h-4" />
              Past Interviews
            </button>
          )}
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-xs underline hover:no-underline">
            Dismiss
          </button>
        </div>
      )}

      {/* MODE 1: SETUP INTERVIEW WIZARD */}
      {mode === 'setup' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-brand-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Configure Your Mock Interview
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Tailored for engineering campus drives and technical viva defense.
              </p>
            </div>
          </div>

          <form onSubmit={handleStartInterview} className="space-y-6">
            {/* Interview Type Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Interview Track
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setInterviewType('Technical')}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col gap-1 ${
                    interviewType === 'Technical'
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="font-bold text-sm">Technical Round</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Data structures, frameworks, backend architecture, and core CS.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setInterviewType('HR')}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col gap-1 ${
                    interviewType === 'HR'
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="font-bold text-sm">HR & Behavioral</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Conflict resolution, teamwork, career goals, and STAR method.
                  </span>
                </button>
              </div>
            </div>

            {/* Target Role Selector */}
            {interviewType === 'Technical' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Target Engineering Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  <option value="MERN Stack Developer">MERN Stack Developer</option>
                  <option value="Java Developer">Java Developer (Spring Boot / Core)</option>
                  <option value="Software Engineer">Software Engineer (General CS Core / DSA)</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Frontend Developer">Frontend Developer (React / JavaScript)</option>
                </select>
              </div>
            )}

            {/* Difficulty & Number of Questions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  <option value="Beginner">Entry Level / Freshers</option>
                  <option value="Intermediate">Intermediate (Campus Placements)</option>
                  <option value="Advanced">Advanced (Product Companies)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Number of Questions
                </label>
                <select
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  <option value="2">2 Questions (Quick Sprint - 5 mins)</option>
                  <option value="3">3 Questions (Standard Mock - 10 mins)</option>
                  <option value="5">5 Questions (Full Placement Round - 20 mins)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Tailored Questions...
                  </>
                ) : (
                  <>
                    Start Placement Interview <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODE 2: LIVE INTERVIEW ROOM */}
      {mode === 'live' && currentQuestion && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Progress & Live Clock Header */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                Question {questionIndex + 1} of {activeSession?.totalQuestions || 3}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {activeSession?.role} • {activeSession?.interviewType}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-brand-500" />
                {formatTimer(secondsElapsed)}
              </div>
              <button
                onClick={handleFinishEarly}
                className="text-xs font-semibold text-rose-500 hover:underline"
              >
                End Early
              </button>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Topic: {currentQuestion.topic}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
              "{currentQuestion.questionText}"
            </h3>

            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Your Answer / Explanation:
              </label>
              <textarea
                rows={7}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your technical explanation here as you would speak it to an interviewer... Include key definitions, working mechanism, code/design example, and trade-offs."
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none leading-relaxed resize-y"
              />

              <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                <span>
                  Words: {userAnswer.trim().split(/\s+/).filter(Boolean).length} | Characters:{' '}
                  {userAnswer.length}
                </span>
                <span>Pro tip: Aim for 30+ words with structured reasoning for best score</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSubmitAnswer}
                disabled={loading || !userAnswer.trim()}
                className="py-3 px-6 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    AI Evaluating Answer...
                  </>
                ) : (
                  <>
                    Submit Answer & Evaluate <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: ANSWER EVALUATION / FEEDBACK VIEW */}
      {mode === 'feedback' && lastEvaluation && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Question {questionIndex + 1} Evaluation
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  AI Interviewer Critique
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-500">Question Score</div>
                  <div className="text-2xl font-black text-brand-600 dark:text-brand-400">
                    {lastEvaluation.evaluation.score} <span className="text-sm font-normal text-slate-400">/ 10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Criteria Breakdown Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-brand-500" />
                Performance Across 5 Assessment Criteria
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Object.entries(lastEvaluation.evaluation.criteriaScores || {}).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center"
                  >
                    <div className="text-[11px] font-medium text-slate-500 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </div>
                    <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {val} <span className="text-[10px] text-slate-400">/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Observations */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                Interviewer Assessment
              </div>
              <p className="text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed">
                {lastEvaluation.evaluation.feedback}
              </p>
            </div>

            {/* Suggested Improvement / Viva Phrasing */}
            {lastEvaluation.evaluation.suggestedImprovement && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  <TrendingUp className="w-4 h-4" />
                  Recommended Viva Phrasing & Delivery
                </div>
                <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                  {lastEvaluation.evaluation.suggestedImprovement}
                </p>
              </div>
            )}

            {/* Topics to revise */}
            {lastEvaluation.evaluation.topicsToRevise?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-brand-500" />
                  Key Concepts Recommended for Revision:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {lastEvaluation.evaluation.topicsToRevise.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Next Action Button */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="py-3 px-6 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition flex items-center gap-2"
              >
                {lastEvaluation.nextQuestion ? (
                  <>
                    Proceed to Next Question ({lastEvaluation.nextQuestion.index + 1}){' '}
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    View Final Placement Report <Award className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 4: FINAL INTERVIEW SUMMARY REPORT */}
      {mode === 'summary' && activeSession && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
                  Interview Completed
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-2">
                  Placement Readiness Score
                </h2>
                <p className="text-brand-100 text-sm mt-1 max-w-xl">
                  {activeSession.overallFeedback ||
                    'Comprehensive evaluation of your technical accuracy, clarity, and communication.'}
                </p>
              </div>

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20">
                <Award className="w-10 h-10 text-amber-300" />
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold text-brand-100">
                    Final Score
                  </div>
                  <div className="text-4xl font-black">{activeSession.finalScore || 0} / 100</div>
                </div>
              </div>
            </div>
          </div>

          {/* Session Details Accordion / Question List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-500" />
              Detailed Question-by-Question Review
            </h3>

            <div className="space-y-4">
              {activeSession.answers?.map((ans, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                        Question {idx + 1}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {ans.questionText}
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 whitespace-nowrap">
                      Score: {ans.score} / 10
                    </span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-xs text-slate-400 block mb-1">
                      YOUR ANSWER:
                    </span>
                    {ans.userAnswer}
                  </div>

                  <div className="text-xs space-y-2 text-slate-600 dark:text-slate-400 pt-1">
                    <p>
                      <strong className="text-slate-800 dark:text-slate-200">Critique:</strong>{' '}
                      {ans.feedback}
                    </p>
                    {ans.suggestedImprovement && (
                      <p>
                        <strong className="text-amber-600 dark:text-amber-400">
                          Viva Tip:
                        </strong>{' '}
                        {ans.suggestedImprovement}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={loadHistory}
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                View Past Sessions
              </button>

              <button
                onClick={() => setMode('setup')}
                className="py-3 px-6 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition flex items-center gap-2"
              >
                Practice Another Round <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 5: PAST SESSIONS HISTORY */}
      {mode === 'history' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Your Past Mock Interviews
            </h2>
            <button
              onClick={() => setMode('setup')}
              className="py-2.5 px-5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition flex items-center gap-1.5"
            >
              Start New Interview <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {historyList.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <Bot className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200">No mock interviews yet</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Complete your first mock interview to get detailed AI scoring and personalized viva recommendations.
              </p>
              <button
                onClick={() => setMode('setup')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold"
              >
                Start Practice Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {historyList.map((item) => (
                <div
                  key={item._id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-500/50 transition cursor-pointer"
                  onClick={() => handleViewHistoryDetail(item._id)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                        {item.interviewType} Round
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      {item.role}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Questions answered: {item.answers?.length || 0} / {item.totalQuestions || 3}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-400">Final Score</div>
                      <div className="text-2xl font-black text-brand-600 dark:text-brand-400">
                        {item.finalScore || 0}
                        <span className="text-xs font-normal text-slate-400">/100</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal / Overlay for viewing selected history item */}
          {selectedHistoryItem && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 max-h-[85vh] overflow-y-auto space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                      {selectedHistoryItem.interviewType} Interview
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {selectedHistoryItem.role}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-400">Score</span>
                    <div className="text-2xl font-black text-brand-600">
                      {selectedHistoryItem.finalScore || 0}/100
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedHistoryItem.answers?.map((ans, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          Q{idx + 1}: {ans.questionText}
                        </span>
                        <span className="text-xs font-bold text-brand-600 whitespace-nowrap">
                          {ans.score}/10
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                        "{ans.userAnswer}"
                      </p>
                      <p className="text-xs text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-700">
                        {ans.feedback}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setSelectedHistoryItem(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200"
                  >
                    Close Review
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
