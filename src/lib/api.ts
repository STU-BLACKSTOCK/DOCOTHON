import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (aadhaarId: string, password: string) => {
    const response = await api.post('/auth/login', {
      username: aadhaarId,
      password,
    });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

export const patientsApi = {
  getPatients: async () => {
    const response = await api.get('/patients');
    return response.data;
  },
  getPatient: async (id: string) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },
  createPatient: async (patientData: any) => {
    const response = await api.post('/patients', patientData);
    return response.data;
  },
};

export const documentsApi = {
  uploadDocument: async (formData: FormData) => {
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getDocuments: async () => {
    const response = await api.get('/documents');
    return response.data;
  },
};

export default api;