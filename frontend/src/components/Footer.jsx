import React from 'react';
import { Compass, Heart, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-300">
                CareerPilot AI
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm">
              An AI-powered career and placement preparation platform engineered for college undergraduates, enabling realistic mock interviews, intelligent resume parsing, skill gap analysis, and aptitude testing.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Final-Year B.Tech Computer Science & Design Capstone Project.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Preparation Modules
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>AI Resume Analyzer</li>
              <li>Personalized Roadmaps</li>
              <li>AI Mock Interviews</li>
              <li>Aptitude & Coding Tests</li>
              <li>Job & Internship Board</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Technology Stack
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>MongoDB & Mongoose</li>
              <li>Express.js & Node.js</li>
              <li>React.js & Tailwind CSS</li>
              <li>Google Gemini AI</li>
              <li>JWT Authentication</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} CareerPilot AI. Built for placement preparation & academic showcase.</p>
          <div className="flex items-center space-x-4 mt-3 sm:mt-0">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for final year viva
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
