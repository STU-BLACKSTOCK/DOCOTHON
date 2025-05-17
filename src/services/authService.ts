import axios from 'axios';

const API_URL = 'http://localhost:8000'; // FastAPI backend URL

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    name: string;
    role: string;
    aadhaar_id: string;
    abha_id?: string;
  };
  error?: string;
}

export const loginUser = async (id: string, password: string, role: string): Promise<LoginResponse> => {
  try {
    console.log('Login attempt:', { id, role }); // Debug log

    const response = await axios.post(`${API_URL}/api/auth/login`, {
      id,
      password,
      role
    });

    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error);
    return {
      success: false,
      error: error.response?.data?.detail || 'An error occurred during login'
    };
  }
}; 