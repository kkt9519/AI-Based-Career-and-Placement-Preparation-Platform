import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Map,
  Briefcase,
  Bot,
  Brain,
  User,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, isAdmin } = useAuth();

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/resume-analyzer', label: 'AI Resume Analyzer', icon: FileText },
    { to: '/career-roadmap', label: 'Career Roadmap', icon: Map },
    { to: '/jobs', label: 'Jobs & Internships', icon: Briefcase },
    { to: '/mock-interview', label: 'AI Mock Interview', icon: Bot },
    { to: '/assessments', label: 'Aptitude & Coding', icon: Brain },
    { to: '/profile', label: 'My Profile', icon: User },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Overview', icon: Shield },
    { to: '/admin/users', label: 'Manage Users', icon: User },
    { to: '/admin/jobs', label: 'Manage Jobs', icon: Briefcase },
    { to: '/admin/questions', label: 'Question Banks', icon: HelpCircle },
  ];

  const linkClasses = ({ isActive }) =>
    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-semibold shadow-sm'
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
    }`;

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-[calc(100vh-4rem)] p-4 transition-colors">
      {/* Target role indicator card */}
      <div className="mb-6 p-3 rounded-2xl bg-gradient-to-br from-brand-50 to-indigo-50/50 dark:from-slate-800 dark:to-slate-800/50 border border-brand-100 dark:border-slate-700">
        <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Target Career Role
        </p>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5">
          {user?.targetRole || 'Software Engineer'}
        </p>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Readiness</span>
          <span className="font-semibold text-brand-600 dark:text-brand-400">
            {user?.profileCompletion || 0}%
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1 overflow-hidden">
          <div
            className="bg-brand-600 dark:bg-brand-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${user?.profileCompletion || 0}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Student Preparation
          </p>
          <nav className="space-y-1">
            {studentLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} className={linkClasses}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {isAdmin && (
          <div>
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 mb-2">
              Administration
            </p>
            <nav className="space-y-1">
              {adminLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.to} to={item.to} className={linkClasses}>
                    <Icon className="w-4 h-4 flex-shrink-0 text-indigo-500" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
