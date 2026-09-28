import React, { useState, useEffect } from 'react';
import { careerAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Map,
  CheckCircle2,
  Circle,
  ExternalLink,
  Sparkles,
  Target,
  ArrowRight,
  RefreshCw,
  FolderGit2,
  Check,
  AlertCircle,
  BookOpen,
  Award,
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const ROLES = [
  'MERN Stack Developer',
  'Java Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Software Engineer',
];

const CareerRoadmapPage = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [selectedRole, setSelectedRole] = useState(user?.targetRole || 'MERN Stack Developer');
  const [togglingId, setTogglingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadRoadmap = async () => {
    try {
      const res = await careerAPI.getRoadmap();
      if (res.data.success && res.data.roadmap) {
        setRoadmap(res.data.roadmap);
        setSelectedRole(res.data.roadmap.targetRole);
      }
    } catch (err) {
      setErrorMsg('Failed to load career roadmap.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await careerAPI.generateRoadmap({
        targetRole: selectedRole,
        currentSkills: user?.skills || [],
        careerGoals: user?.careerGoals || '',
      });

      if (res.data.success) {
        setRoadmap(res.data.roadmap);
        setSuccessMsg(`Personalized preparation roadmap generated for ${selectedRole}!`);
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to generate roadmap.');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleMilestone = async (milestoneId) => {
    if (!roadmap) return;
    setTogglingId(milestoneId);

    try {
      const res = await careerAPI.toggleMilestone(roadmap._id, milestoneId);
      if (res.data.success) {
        setRoadmap(res.data.roadmap);
      }
    } catch (err) {
      setErrorMsg('Failed to update milestone progress.');
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading career preparation roadmap..." />;
  }

  const completedCount = roadmap?.milestones?.filter((m) => m.completed).length || 0;
  const totalCount = roadmap?.milestones?.length || 1;
  const progressPercent = roadmap?.overallProgress ?? Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-brand-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white">
            <Sparkles className="w-3.5 h-3.5" /> Structured Placement Curriculum
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Personalized Career Roadmap
          </h1>
          <p className="text-sm text-amber-100 leading-relaxed">
            Step-by-step technical milestones, recommended capstone projects, and curated learning references customized for your placement target.
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex flex-col items-center justify-center min-w-[200px]">
          <span className="text-xs uppercase tracking-wider text-amber-100 font-bold">
            Roadmap Completed
          </span>
          <div className="text-3xl font-black mt-1 mb-1">{progressPercent}%</div>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="mt-2 text-[11px] font-semibold text-amber-100">
            {completedCount} of {totalCount} Milestones Done
          </span>
        </div>
      </div>

      {/* Role Switcher Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Target className="w-5 h-5 text-brand-600 flex-shrink-0" />
          <div className="w-full sm:w-auto">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              Target Track
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm disabled:opacity-50 transition-all"
        >
          {generating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Calibrating Roadmap...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2 text-amber-300" /> Switch / Regenerate Roadmap
            </>
          )}
        </button>
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

      {/* Missing Skills Warning Banner */}
      {roadmap?.missingSkills && roadmap.missingSkills.length > 0 && (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" /> Identified Placement Skill Gaps for {roadmap.targetRole}
            </h3>
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
              Add these skills to your profile and portfolio to match company placement requirements:
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {roadmap.missingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-sm"
              >
                + {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Milestones Step-by-Step Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-600" /> Milestones & Syllabus
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Click checkbox to mark milestone as completed
          </span>
        </div>

        <div className="space-y-4">
          {roadmap?.milestones?.map((milestone, idx) => (
            <div
              key={milestone._id || idx}
              className={`p-6 rounded-3xl border transition-all duration-200 ${
                milestone.completed
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/80 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-4">
                  {/* Interactive Completion Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleMilestone(milestone._id)}
                    disabled={togglingId === milestone._id}
                    className={`mt-1 w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                      milestone.completed
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'border-2 border-slate-300 dark:border-slate-600 hover:border-brand-500 text-transparent'
                    }`}
                  >
                    {milestone.completed ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Milestone {idx + 1}
                      </span>
                      {milestone.completed && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          Completed
                        </span>
                      )}
                    </div>
                    <h3
                      className={`text-base font-bold ${
                        milestone.completed
                          ? 'text-slate-900 dark:text-white line-through opacity-80'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {milestone.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {milestone.description}
                    </p>

                    {/* Topics Chips */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {milestone.topics?.map((topic, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    {/* Resources */}
                    {milestone.resources && milestone.resources.length > 0 && (
                      <div className="pt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Recommended:</span>
                        {milestone.resources.map((res, rIdx) => (
                          <span key={rIdx} className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 font-medium">
                            <BookOpen className="w-3 h-3" /> {res}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Capstone Projects */}
      {roadmap?.recommendedProjects && roadmap.recommendedProjects.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-indigo-600" /> Recommended Portfolio Projects
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Build these to showcase on your resume
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmap.recommendedProjects.map((proj, pIdx) => (
              <div
                key={proj._id || pIdx}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-brand-500 dark:hover:border-brand-500 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                      {proj.difficulty}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Project #{pIdx + 1}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {proj.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                  {proj.techStack?.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerRoadmapPage;
