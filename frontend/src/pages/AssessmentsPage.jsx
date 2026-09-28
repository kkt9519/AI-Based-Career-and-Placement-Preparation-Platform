import React, { useState, useEffect } from 'react';
import {
  Brain,
  Code2,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  BarChart3,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  Flag,
  HelpCircle,
  Play,
  ArrowRight,
  Filter,
  Eye,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { assessmentAPI } from '../services/api';

const CATEGORIES = [
  { id: 'All-Rounder', label: 'All-Rounder (Full Test)', icon: Award, desc: 'Mix of Aptitude, CS Core, and Coding' },
  { id: 'Quantitative', label: 'Quantitative Aptitude', icon: BarChart3, desc: 'Percentages, Speed, Time, Profit & Loss' },
  { id: 'Logical Reasoning', label: 'Logical Reasoning', icon: Brain, desc: 'Syllogisms, Coding-Decoding, Series' },
  { id: 'Verbal Ability', label: 'Verbal Ability', icon: FileCheck, desc: 'Grammar, Reading Comprehension, Vocab' },
  { id: 'CS Core', label: 'CS Core Subjects', icon: HelpCircle, desc: 'OS, DBMS, Networks, Data Structures' },
  { id: 'Coding', label: 'Coding Challenges', icon: Code2, desc: 'DSA Problem Solving & Algorithms' },
];

export default function AssessmentsPage() {
  const [activeTab, setActiveTab] = useState('tests'); // 'tests' | 'browse' | 'history'

  // Test setup & active test states
  const [selectedCategory, setSelectedCategory] = useState('All-Rounder');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(5);

  const [activeTest, setActiveTest] = useState(null); // When test is in progress
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: { selectedOptionId, submittedCode } }
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);

  // Completed Test Review State
  const [testResult, setTestResult] = useState(null);

  // Question bank explorer states
  const [browseCategory, setBrowseCategory] = useState('All');
  const [browseQuestions, setBrowseQuestions] = useState([]);
  const [revealedExplanations, setRevealedExplanations] = useState(new Set());

  // Stats & History
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  // Loading & error
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Initial stats fetch
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await assessmentAPI.getStats();
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (e) {
      console.error('Failed to load stats:', e);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await assessmentAPI.getHistory();
      if (res.data?.success) {
        setHistory(res.data.data);
      }
    } catch (e) {
      setError('Failed to fetch test history.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBrowseQuestions = async (cat = 'All') => {
    setLoading(true);
    try {
      const res = await assessmentAPI.getQuestions({
        category: cat !== 'All' ? cat : undefined,
        limit: 30,
      });
      if (res.data?.success) {
        setBrowseQuestions(res.data.data);
      }
    } catch (e) {
      setError('Failed to load questions.');
    } finally {
      setLoading(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (isTestActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTestActive, secondsRemaining]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Start a new timed assessment
  const handleStartTest = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await assessmentAPI.startAssessment({
        category: selectedCategory,
        difficulty: selectedDifficulty,
        totalQuestions: parseInt(questionCount, 10),
      });

      if (res.data?.success) {
        const testData = res.data.data;
        setActiveTest(testData);
        setCurrentQIndex(0);
        setUserAnswers({});
        setFlaggedQuestions(new Set());
        setTestResult(null);
        setSecondsRemaining(testData.allocatedTimeMinutes * 60);
        setIsTestActive(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start assessment.');
    } finally {
      setLoading(false);
    }
  };

  // Select MCQ option
  const handleSelectOption = (questionId, optionId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedOptionId: optionId,
      },
    }));
  };

  // Edit Code
  const handleCodeChange = (questionId, code) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        submittedCode: code,
      },
    }));
  };

  // Toggle question flag
  const toggleFlag = (qIndex) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(qIndex)) next.delete(qIndex);
      else next.add(qIndex);
      return next;
    });
  };

  // Submit assessment
  const handleSubmitTest = async () => {
    if (!activeTest) return;
    setSubmitting(true);
    setIsTestActive(false);

    try {
      const formattedAnswers = activeTest.questions.map((q) => {
        const ans = userAnswers[q._id] || {};
        return {
          questionId: q._id,
          selectedOptionId: ans.selectedOptionId || null,
          submittedCode: ans.submittedCode || (q.codingDetails?.starterCode || null),
        };
      });

      const totalTimeSpent = activeTest.allocatedTimeMinutes * 60 - secondsRemaining;

      const res = await assessmentAPI.submitAssessment(activeTest.assessmentId, {
        answers: formattedAnswers,
        timeSpentSeconds: totalTimeSpent,
      });

      if (res.data?.success) {
        setTestResult(res.data.data);
        setActiveTest(null);
        fetchStats(); // Update dashboard aggregate stats
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit assessment.');
      setIsTestActive(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAutoSubmit = () => {
    handleSubmitTest();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {!isTestActive && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 mb-2">
              <Brain className="w-3.5 h-3.5" />
              Placement Preparation Round
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Aptitude & Technical Assessments
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Practice timed placement tests, solve coding problems, and evaluate topic-wise strengths.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
            <button
              onClick={() => {
                setActiveTab('tests');
                setTestResult(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'tests'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Timed Tests
            </button>
            <button
              onClick={() => {
                setActiveTab('browse');
                fetchBrowseQuestions('All');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'browse'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Question Bank
            </button>
            <button
              onClick={() => {
                setActiveTab('history');
                fetchHistory();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              My Analytics
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      {/* -------------------- 1. TIMED TEST ROOM (ACTIVE) -------------------- */}
      {isTestActive && activeTest && (
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Test Header Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                {activeTest.category} • {activeTest.difficulty} Level
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {activeTest.title}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-mono font-bold ${
                  secondsRemaining < 120
                    ? 'bg-rose-100 text-rose-700 animate-pulse'
                    : 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                }`}
              >
                <Clock className="w-4 h-4" />
                {formatTime(secondsRemaining)}
              </div>

              <button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="py-2.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Test'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left 3 cols: Question Area */}
            <div className="lg:col-span-3 space-y-4">
              {(() => {
                const q = activeTest.questions[currentQIndex];
                if (!q) return null;
                const isMCQ = q.type === 'mcq';
                const currentAnswer = userAnswers[q._id] || {};

                return (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          Q {currentQIndex + 1} of {activeTest.questions.length}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          {q.category}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleFlag(currentQIndex)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition ${
                          flaggedQuestions.has(currentQIndex)
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <Flag className="w-3.5 h-3.5" />
                        {flaggedQuestions.has(currentQIndex) ? 'Flagged' : 'Flag Question'}
                      </button>
                    </div>

                    {/* Question Statement */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                        {q.title}
                      </h3>
                      {q.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                          {q.description}
                        </p>
                      )}
                    </div>

                    {/* MCQ Options */}
                    {isMCQ ? (
                      <div className="space-y-3 pt-2">
                        {q.options.map((opt) => {
                          const isSelected = currentAnswer.selectedOptionId === opt.optionId;
                          return (
                            <button
                              key={opt.optionId}
                              onClick={() => handleSelectOption(q._id, opt.optionId)}
                              className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition flex items-center justify-between ${
                                isSelected
                                  ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100 ring-2 ring-brand-500/20'
                                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <span>{opt.text}</span>
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                  isSelected
                                    ? 'border-brand-600 bg-brand-600 text-white'
                                    : 'border-slate-300 dark:border-slate-600'
                                }`}
                              >
                                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      /* Coding Editor Area */
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Language: JavaScript</span>
                          <span>Input: {q.codingDetails?.sampleInput}</span>
                        </div>
                        <textarea
                          rows={12}
                          value={
                            currentAnswer.submittedCode !== undefined
                              ? currentAnswer.submittedCode
                              : q.codingDetails?.starterCode || ''
                          }
                          onChange={(e) => handleCodeChange(q._id, e.target.value)}
                          className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-900 text-emerald-400 font-mono text-xs leading-relaxed outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentQIndex === 0}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30"
                      >
                        <ChevronLeft className="w-4 h-4" /> Previous
                      </button>

                      {currentQIndex < activeTest.questions.length - 1 ? (
                        <button
                          onClick={() => setCurrentQIndex((prev) => prev + 1)}
                          className="flex items-center gap-1 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-sm transition"
                        >
                          Next <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmitTest}
                          disabled={submitting}
                          className="flex items-center gap-1 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition"
                        >
                          Finish & Submit
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Right 1 col: Question Palette */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Question Palette
                </h4>

                <div className="grid grid-cols-4 gap-2">
                  {activeTest.questions.map((q, idx) => {
                    const isAnswered =
                      userAnswers[q._id]?.selectedOptionId ||
                      userAnswers[q._id]?.submittedCode;
                    const isFlagged = flaggedQuestions.has(idx);
                    const isCurrent = idx === currentQIndex;

                    let bgClass = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
                    if (isAnswered) bgClass = 'bg-emerald-500 text-white';
                    if (isFlagged) bgClass = 'bg-amber-400 text-white';
                    if (isCurrent) bgClass += ' ring-2 ring-brand-500 ring-offset-2';

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentQIndex(idx)}
                        className={`h-10 rounded-xl text-xs font-bold transition flex items-center justify-center ${bgClass}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="text-[11px] space-y-1.5 text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-emerald-500" /> Answered
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-amber-400" /> Flagged for Review
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700" /> Not Attempted
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- 2. TEST RESULTS & VIVA EXPLANATIONS -------------------- */}
      {testResult && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div
            className={`rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 ${
              testResult.passed
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700'
                : 'bg-gradient-to-r from-amber-600 via-rose-600 to-red-600'
            }`}
          >
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
                {testResult.passed ? 'Test Passed 🎉' : 'Assessment Completed'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">{testResult.title}</h2>
              <p className="text-white/80 text-sm max-w-lg">
                {testResult.passed
                  ? 'Strong performance! You have cleared the qualifying threshold for this placement topic.'
                  : 'Review the detailed technical explanations below to clarify conceptual gaps before your campus interviews.'}
              </p>
            </div>

            <div className="flex items-center gap-5 bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20">
              <div>
                <div className="text-xs uppercase tracking-wider font-bold text-white/80">
                  Your Score
                </div>
                <div className="text-3xl sm:text-4xl font-black">
                  {testResult.percentage}%
                </div>
                <div className="text-xs text-white/70">
                  {testResult.score} / {testResult.totalQuestions} correct
                </div>
              </div>
            </div>
          </div>

          {/* Question Review Cards */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-brand-500" />
              Detailed Solutions & Explanations
            </h3>

            <div className="space-y-4">
              {testResult.questionReview?.map((q, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border space-y-3 ${
                    q.isCorrect
                      ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/50 dark:bg-emerald-950/20'
                      : 'border-rose-200 bg-rose-50/30 dark:border-rose-900/50 dark:bg-rose-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-400">Question {idx + 1}</span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {q.title}
                      </h4>
                      {q.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-400">{q.description}</p>
                      )}
                    </div>

                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                        q.isCorrect
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {q.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {q.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  {/* MCQ Options Display */}
                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {q.options?.map((opt) => {
                        const isUserChoice = opt.optionId === q.selectedOptionId;
                        const isCorrectChoice = opt.isCorrect;

                        let style = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300';
                        if (isCorrectChoice) {
                          style = 'bg-emerald-100/70 border-emerald-500 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200 font-bold';
                        } else if (isUserChoice && !isCorrectChoice) {
                          style = 'bg-rose-100/70 border-rose-500 text-rose-900 dark:bg-rose-950/70 dark:text-rose-200 line-through';
                        }

                        return (
                          <div key={opt.optionId} className={`p-3 rounded-xl border text-xs ${style}`}>
                            {opt.text} {isCorrectChoice && '✓ (Correct Answer)'}{' '}
                            {isUserChoice && !isCorrectChoice && '✗ (Your Choice)'}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Coding Submission Display */}
                  {q.type === 'coding' && (
                    <div className="space-y-2 pt-2">
                      <div className="p-3.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
                        <span className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase font-sans">
                          Your Submitted Solution:
                        </span>
                        <pre className="whitespace-pre-wrap">{q.submittedCode || '// No code submitted'}</pre>
                      </div>
                    </div>
                  )}

                  {/* Viva Explanation */}
                  {q.explanation && (
                    <div className="pt-2 text-xs bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                      <strong className="text-brand-600 dark:text-brand-400 block mb-1">
                        Viva Explanation:
                      </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setTestResult(null)}
                className="py-3 px-6 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Practice Another Topic
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- 3. TAB: PRACTICE TESTS (CONFIG WIZARD) -------------------- */}
      {activeTab === 'tests' && !isTestActive && !testResult && (
        <div className="space-y-6">
          {/* Top Quick Stats Strip */}
          {stats && stats.totalAssessments > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Tests Completed</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {stats.totalAssessments}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Average Score</span>
                <div className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">
                  {stats.averagePercentage}%
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Tests Passed (&ge;60%)</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">
                  {stats.testsPassed}
                </div>
              </div>
            </div>
          )}

          {/* Test Setup Card */}
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Select Assessment Category
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Choose a placement topic to start a randomized, timed assessment.
              </p>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-4 rounded-2xl border text-left transition flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl ${
                        isSelected
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">
                        {cat.label}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {cat.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Difficulty & Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Mixed">Mixed (Campus Simulation)</option>
                  <option value="Easy">Easy (Foundation / Freshers)</option>
                  <option value="Medium">Medium (Standard Tier-1/2 Drives)</option>
                  <option value="Hard">Hard (Product Companies)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Question Count
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="3">3 Questions (Quick Practice - ~10 mins)</option>
                  <option value="5">5 Questions (Standard Test - ~15 mins)</option>
                  <option value="10">10 Questions (Full Assessment - ~30 mins)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleStartTest}
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Test Paper...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" /> Start Timed Assessment
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* -------------------- 4. TAB: QUESTION BANK EXPLORER -------------------- */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Quantitative', 'Logical Reasoning', 'Verbal Ability', 'CS Core', 'Coding'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setBrowseCategory(cat);
                    fetchBrowseQuestions(cat);
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
                    browseCategory === cat
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {browseQuestions.map((q) => {
              const isRevealed = revealedExplanations.has(q._id);
              return (
                <div
                  key={q._id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                        {q.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{q.difficulty}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {q.tags?.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {q.title}
                  </h3>
                  {q.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">{q.description}</p>
                  )}

                  {q.options?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt) => (
                        <div
                          key={opt.optionId}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
                        >
                          {opt.text}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.codingDetails?.starterCode && (
                    <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 text-xs font-mono overflow-x-auto">
                      {q.codingDetails.starterCode}
                    </pre>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* -------------------- 5. TAB: PERFORMANCE ANALYTICS & HISTORY -------------------- */}
      {activeTab === 'history' && (
        <div className="max-w-4xl mx-auto space-y-6">
          {stats && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-500" />
                Category-Wise Performance Matrix
              </h3>

              <div className="space-y-4">
                {Object.entries(stats.categoryBreakdown || {}).map(([cat, val]) => (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>{cat}</span>
                      <span>{val}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          val >= 70 ? 'bg-emerald-500' : val >= 50 ? 'bg-brand-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test History List */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Completed Test History
            </h3>

            {history.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
                <Award className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No completed assessments recorded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {history.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(item.completedAt || item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white mt-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Score: {item.score} / {item.totalQuestions} ({item.percentage}%) •{' '}
                        {item.passed ? 'Passed' : 'Failed'}
                      </p>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-2xl font-black ${
                          item.passed ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
