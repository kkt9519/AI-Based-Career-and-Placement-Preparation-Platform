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
import ProfilePage from './pages/ProfilePage';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';
import CareerRoadmapPage from './pages/CareerRoadmapPage';
import JobsPage from './pages/JobsPage';
import MockInterviewPage from './pages/MockInterviewPage';
import AssessmentsPage from './pages/AssessmentsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

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
                        <ProfilePage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/resume-analyzer"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ResumeAnalyzerPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/career-roadmap"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <CareerRoadmapPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/jobs"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <JobsPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/mock-interview"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <MockInterviewPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/assessments"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <AssessmentsPage />
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
                        <AdminDashboardPage />
                      </AppLayout>
                    </AdminRoute>
                  }
                />

                <Route
                  path="/admin/*"
                  element={
                    <AdminRoute>
                      <AppLayout>
                        <AdminDashboardPage />
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
