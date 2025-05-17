import axios from 'axios';

const API_URL = 'http://localhost:8000'; // FastAPI backend URL

export interface User {
  id: string;
  name: string;
  role: string;
  aadhaar_id: string;
  abha_id?: string;
  specialization?: string;  // For doctors
  department?: string;      // For staff
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export const loginUser = async (id: string, password: string, role: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
      id,
      password,
      role
    });

    if (response.data.success && response.data.token) {
      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error);
    return {
      success: false,
      error: error.response?.data?.error || 'An error occurred during login'
    };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
}; 