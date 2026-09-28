import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';

// Placeholder view for modules to be built in subsequent phases
const ModulePlaceholder = ({ title, phase, description }) => (
  <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-center space-y-4 max-w-xl mx-auto my-12">
    <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
      Phase {phase} Module
    </div>
    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{title}</h2>
    <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
    <p className="text-xs text-slate-400 font-mono">
      CareerPilot AI • Production MERN Pipeline
    </p>
  </div>
);

// App Layout with Sidebar for Authenticated Pages
const AppLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)] max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
            <Navbar />

            <div className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Protected Student Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <DashboardPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ModulePlaceholder
                          title="Student Profile Management"
                          phase="2"
                          description="Full profile editor with education details, GPA, GitHub/LinkedIn links, and target role customization."
                        />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/resume-analyzer"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ModulePlaceholder
                          title="AI Resume Analyzer"
                          phase="3"
                          description="Upload PDF/DOCX resumes, extract text, and receive Gemini-powered ATS scores and keyword suggestions."
                        />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/career-roadmap"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ModulePlaceholder
                          title="Personalized Career Roadmap"
                          phase="3"
                          description="Step-by-step career milestones and learning tracks for MERN, Java, and Full Stack Developer roles."
                        />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/jobs"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ModulePlaceholder
                          title="Job & Internship Board"
                          phase="4"
                          description="Browse opportunities with transparent skill-match scoring and track your application statuses."
                        />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/mock-interview"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ModulePlaceholder
                          title="AI Mock Interview Simulator"
                          phase="5"
                          description="Practice real-time Technical and HR interviews with AI-driven scoring and personalized suggestions."
                        />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/assessments"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ModulePlaceholder
                          title="Aptitude & Coding Practice"
                          phase="6"
                          description="Quantitative, Logical, Verbal, and Core CS assessments with timed tests and detailed answer explanations."
                        />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AppLayout>
                        <ModulePlaceholder
                          title="Admin Overview & Platform Analytics"
                          phase="7"
                          description="Monitor platform activity, registered student counts, interview metrics, and active jobs."
                        />
                      </AppLayout>
                    </AdminRoute>
                  }
                />

                <Route
                  path="/admin/*"
                  element={
                    <AdminRoute>
                      <AppLayout>
                        <ModulePlaceholder
                          title="Admin Management Console"
                          phase="7"
                          description="Manage students, edit job listings, and curate question banks."
                        />
                      </AppLayout>
                    </AdminRoute>
                  }
                />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
