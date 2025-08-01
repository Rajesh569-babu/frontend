import axios from 'axios';

const API_BASE_URL = 'http://localhost:5003/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: { name: string; email: string; password: string; role?: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data: { email: string; token: string; password: string }) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  verifyResetToken: async (email: string, token: string) => {
    const response = await api.post('/auth/verify-reset-token', { email, token });
    return response.data;
  },
};

// Candidates API
export const candidatesAPI = {
  getAllCandidates: async () => {
    const response = await api.get('/candidates');
    return response.data;
  },

  addCandidate: async (candidateData: { name: string; position: string; photoUrl?: string }) => {
    const response = await api.post('/candidates', candidateData);
    return response.data;
  },

  updateCandidate: async (id: string, candidateData: { name: string; position: string; photoUrl?: string }) => {
    const response = await api.put(`/candidates/${id}`, candidateData);
    return response.data;
  },

  deleteCandidate: async (id: string) => {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  },

  getResults: async () => {
    const response = await api.get('/results');
    return response.data;
  },

  castVote: async (candidateId: string) => {
    const response = await api.post('/votes', { candidateId });
    return response.data;
  },
};

// Voting Settings API
export const votingSettingsAPI = {
  getVotingSettings: async () => {
    const response = await api.get('/voting-settings');
    return response.data;
  },

  updateVotingSettings: async (settings: {
    votingDeadline: string;
    isVotingActive?: boolean;
    allowVoting?: boolean;
    votingTitle?: string;
    votingDescription?: string;
  }) => {
    const response = await api.post('/voting-settings', settings);
    return response.data;
  },

  toggleVoting: async () => {
    const response = await api.put('/voting-settings/toggle');
    return response.data;
  },

  getVotingStatus: async () => {
    const response = await api.get('/voting-settings/status');
    return response.data;
  },
};

export default api; 