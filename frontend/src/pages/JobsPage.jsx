import React, { useState, useEffect } from 'react';
import { jobAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Search,
  MapPin,
  Building2,
  Bookmark,
  BookmarkCheck,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Filter,
  DollarSign,
  AlertCircle,
  Eye,
  X,
  FileCheck,
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const JobsPage = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'saved' | 'applications'
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [workMode, setWorkMode] = useState('All');
  const [jobType, setJobType] = useState('All');
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [applyNotes, setApplyNotes] = useState('');
  const [applying, setApplying] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadJobs = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (workMode !== 'All') params.workMode = workMode;
      if (jobType !== 'All') params.jobType = jobType;

      const res = await jobAPI.getJobs(params);
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      setErrorMsg('Failed to load job listings.');
    }
  };

  const loadSavedAndApplications = async () => {
    try {
      const [savedRes, appsRes] = await Promise.all([
        jobAPI.getSavedJobs(),
        jobAPI.getApplications(),
      ]);

      if (savedRes.data.success) {
        setSavedJobs(savedRes.data.jobs);
      }
      if (appsRes.data.success) {
        setApplications(appsRes.data.applications);
      }
    } catch (err) {
      console.error('Error loading saved/applications:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadJobs(), loadSavedAndApplications()]);
      setLoading(false);
    };
    init();
  }, [search, workMode, jobType]);

  const handleOpenDetails = async (jobId) => {
    setModalLoading(true);
    setErrorMsg('');
    try {
      const res = await jobAPI.getJobById(jobId);
      if (res.data.success) {
        setSelectedJob(res.data.job);
      }
    } catch (err) {
      setErrorMsg('Failed to load job details.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleSave = async (e, jobId, currentlySaved) => {
    e.stopPropagation();
    try {
      if (currentlySaved) {
        await jobAPI.unsaveJob(jobId);
      } else {
        await jobAPI.saveJob(jobId);
      }
      await Promise.all([loadJobs(), loadSavedAndApplications()]);
      if (selectedJob && selectedJob._id === jobId) {
        setSelectedJob((prev) => ({ ...prev, isSaved: !currentlySaved }));
      }
    } catch (err) {
      setErrorMsg('Failed to update bookmark.');
    }
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    setApplying(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await jobAPI.applyToJob(selectedJob._id, applyNotes);
      if (res.data.success) {
        setSuccessMsg(`Application submitted for ${selectedJob.title} at ${selectedJob.company}!`);
        await Promise.all([loadJobs(), loadSavedAndApplications()]);
        setSelectedJob((prev) => ({
          ...prev,
          application: res.data.application,
        }));
        setTimeout(() => setSuccessMsg(''), 5000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 75) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
    if (percentage >= 50) return 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300 border-brand-300 dark:border-brand-800';
    return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'applied':
        return { label: 'Applied', bg: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' };
      case 'under_review':
        return { label: 'Under Review', bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' };
      case 'interview_scheduled':
        return { label: 'Interview Scheduled', bg: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' };
      case 'offered':
        return { label: 'Offer Received', bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' };
      case 'rejected':
        return { label: 'Not Selected', bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' };
      default:
        return { label: status, bg: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' };
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-brand-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Transparent AI Skill Matching
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Job & Internship Opportunities
          </h1>
          <p className="text-sm text-sky-100 leading-relaxed">
            Curated entry-level engineering roles. Each listing compares your profile skills against requirements to give you an objective match score.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'browse' ? 'bg-white text-brand-700 shadow-sm' : 'text-white hover:bg-white/10'
            }`}
          >
            Explore ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'saved' ? 'bg-white text-brand-700 shadow-sm' : 'text-white hover:bg-white/10'
            }`}
          >
            Saved ({savedJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'applications' ? 'bg-white text-brand-700 shadow-sm' : 'text-white hover:bg-white/10'
            }`}
          >
            My Applications ({applications.length})
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Search & Filter Bar (Active on Browse tab) */}
      {activeTab === 'browse' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by job title, company, or skill (e.g. React, Java, HCLTech)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Work Mode Filter */}
            <div>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="All">All Work Modes</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>

            {/* Job Type Filter */}
            <div>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="All">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <LoadingSpinner label="Fetching opportunities..." />
      ) : activeTab === 'browse' ? (
        /* Browse Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              onClick={() => handleOpenDetails(job._id)}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-extrabold text-base flex items-center justify-center flex-shrink-0 shadow-md">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                        {job.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        {job.company}
                      </p>
                    </div>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleSave(e, job._id, job.isSaved)}
                    className="p-2 rounded-xl text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {job.isSaved ? (
                      <BookmarkCheck className="w-5 h-5 text-brand-600 fill-brand-600" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Tags row */}
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <MapPin className="w-3 h-3" /> {job.location} ({job.workMode})
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Briefcase className="w-3 h-3" /> {job.jobType}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <DollarSign className="w-3 h-3" /> {job.salary}
                  </span>
                </div>

                {/* Skill Match Badge */}
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Your Skill Match:
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${getMatchColor(
                        job.matchPercentage
                      )}`}
                    >
                      {job.matchPercentage}%
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {job.matchedSkillsCount} matched • {job.missingSkillsCount} missing
                  </span>
                </div>

                {/* Required Skills Chips */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.requiredSkills?.map((skill, sIdx) => {
                    const candidateHasSkill = user?.skills?.some(
                      (s) => s.toLowerCase() === skill.toLowerCase()
                    );
                    return (
                      <span
                        key={sIdx}
                        className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold ${
                          candidateHasSkill
                            ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {candidateHasSkill ? '✓ ' : ''}{skill}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Action row */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {job.isApplied ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Applied
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">Click to view & apply</span>
                )}
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                  View Details →
                </span>
              </div>
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="col-span-2 text-center py-16 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-3">
              <Briefcase className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                No matching opportunities found
              </p>
              <p className="text-xs text-slate-400">
                Try adjusting your search keywords or clearing filters.
              </p>
            </div>
          )}
        </div>
      ) : activeTab === 'saved' ? (
        /* Saved Jobs Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedJobs.map((job) => (
            <div
              key={job._id}
              onClick={() => handleOpenDetails(job._id)}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 shadow-sm cursor-pointer space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {job.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">{job.company}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleToggleSave(e, job._id, true)}
                  className="p-2 text-brand-600"
                >
                  <BookmarkCheck className="w-5 h-5 fill-brand-600" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5" /> {job.location} • {job.workMode}
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-brand-600">{job.matchPercentage}% Skill Match</span>
                <span className="text-slate-400">Saved on {new Date(job.savedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}

          {savedJobs.length === 0 && (
            <div className="col-span-2 text-center py-16 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-3">
              <Bookmark className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                No bookmarked jobs yet
              </p>
              <p className="text-xs text-slate-400">
                Browse jobs and click the bookmark ribbon icon to save opportunities here.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* My Applications Tab */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Tracked Applications ({applications.length})
          </h2>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {applications.map((app) => (
              <div key={app._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      {app.jobId?.title || 'Job Position'}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        getStatusBadge(app.status).bg
                      }`}
                    >
                      {getStatusBadge(app.status).label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {app.jobId?.company} • {app.jobId?.location} ({app.jobId?.workMode})
                  </p>
                  {app.notes && (
                    <p className="text-xs text-slate-400 italic">"Note: {app.notes}"</p>
                  )}
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenDetails(app.jobId?._id)}
                    className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    View Job →
                  </button>
                </div>
              </div>
            ))}

            {applications.length === 0 && (
              <div className="text-center py-16 space-y-3">
                <Send className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
                <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                  No applications tracked yet
                </p>
                <p className="text-xs text-slate-400">
                  Apply to jobs from the Explore tab to automatically track their status here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Job Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  {selectedJob.company}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {selectedJob.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedJob.location} • {selectedJob.workMode} • {selectedJob.jobType} • {selectedJob.salary}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Skill Match Breakdown Box */}
            {selectedJob.skillMatch && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Transparent Skill Match Analysis
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getMatchColor(
                      selectedJob.skillMatch.matchPercentage
                    )}`}
                  >
                    {selectedJob.skillMatch.matchPercentage}% Match
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-emerald-600 block mb-1">
                      Matched Required Skills ({selectedJob.skillMatch.matchedRequired?.length || 0}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedJob.skillMatch.matchedRequired?.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-[11px]">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-rose-600 block mb-1">
                      Missing Required Skills ({selectedJob.skillMatch.missingRequired?.length || 0}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedJob.skillMatch.missingRequired?.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 text-[11px]">
                          + {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200 dark:border-slate-700">
                  {selectedJob.skillMatch.explanation}
                </p>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Job Description
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedJob.description}
              </p>
            </div>

            {/* Preferred Skills */}
            {selectedJob.preferredSkills && selectedJob.preferredSkills.length > 0 && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Preferred Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.preferredSkills.map((p, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Application Section */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              {selectedJob.application ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm block">Already Applied</span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">
                      Status: {getStatusBadge(selectedJob.application.status).label}
                    </span>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Applicant Note (Optional)
                    </label>
                    <textarea
                      rows="2"
                      value={applyNotes}
                      onChange={(e) => setApplyNotes(e.target.value)}
                      placeholder="Brief note to include with your placement application..."
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={(e) => handleToggleSave(e, selectedJob._id, selectedJob.isSaved)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      {selectedJob.isSaved ? '★ Bookmarked' : '☆ Save Job'}
                    </button>

                    <button
                      type="button"
                      onClick={handleApply}
                      disabled={applying}
                      className="flex-1 inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
                    >
                      {applying ? (
                        'Submitting...'
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" /> Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
