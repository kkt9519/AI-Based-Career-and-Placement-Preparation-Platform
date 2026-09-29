import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor: Attach JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careerpilot_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle global 401s and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if request was to login or register
      const isAuthEndpoint = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthEndpoint) {
        localStorage.removeItem('careerpilot_token');
        localStorage.removeItem('careerpilot_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API Methods
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// User Profile & Dashboard API Methods
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getDashboardStats: () => api.get('/users/dashboard'),
};

// Resume Upload & Extraction API Methods
export const resumeAPI = {
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getResumes: () => api.get('/resumes'),
  getResumeById: (id) => api.get(`/resumes/${id}`),
  deleteResume: (id) => api.delete(`/resumes/${id}`),
  analyzeResume: (id, targetRole) => api.post(`/resumes/${id}/analyze`, { targetRole }),
  getAnalysisHistory: () => api.get('/resumes/analyses/history'),
};

// Career Guidance & Roadmap API Methods
export const careerAPI = {
  getRoadmap: () => api.get('/career/roadmap'),
  generateRoadmap: (data) => api.post('/career/roadmap', data),
  toggleMilestone: (roadmapId, milestoneId) =>
    api.patch(`/career/roadmap/${roadmapId}/milestone/${milestoneId}`),
};

// Job & Internship Portal API Methods
export const jobAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  saveJob: (id) => api.post(`/jobs/${id}/save`),
  unsaveJob: (id) => api.delete(`/jobs/${id}/save`),
  getSavedJobs: () => api.get('/jobs/saved'),
  applyToJob: (id, notes) => api.post(`/jobs/${id}/apply`, { notes }),
  getApplications: () => api.get('/jobs/applications'),
};

// AI Mock Interview API Methods
export const interviewAPI = {
  startInterview: (data) => api.post('/interviews/start', data),
  submitAnswer: (id, data) => api.post(`/interviews/${id}/answer`, data),
  finishInterview: (id) => api.post(`/interviews/${id}/finish`),
  getHistory: (params) => api.get('/interviews/history', { params }),
  getById: (id) => api.get(`/interviews/${id}`),
};

// Aptitude & Coding Assessment API Methods
export const assessmentAPI = {
  getQuestions: (params) => api.get('/assessments/questions', { params }),
  startAssessment: (data) => api.post('/assessments/start', data),
  submitAssessment: (id, data) => api.post(`/assessments/${id}/submit`, data),
  getHistory: (params) => api.get('/assessments/history', { params }),
  getStats: () => api.get('/assessments/stats'),
  getById: (id) => api.get(`/assessments/${id}`),
};

// Admin Console API Methods
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (id, isActive) => api.patch(`/admin/users/${id}/status`, { isActive }),
  createJob: (data) => api.post('/admin/jobs', data),
  updateJob: (id, data) => api.put(`/admin/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
  createQuestion: (data) => api.post('/admin/questions', data),
  updateQuestion: (id, data) => api.put(`/admin/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/admin/questions/${id}`),
};

export default api;
