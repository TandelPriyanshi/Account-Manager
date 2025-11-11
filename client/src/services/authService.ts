import axios from 'axios';
import { toast } from 'react-toastify';

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
};

const API_URL = '/api';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

// Set up axios defaults
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure headers exist and add Authorization header
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 Unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login if token is invalid/expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    toast.success('Login successful!');
    return response.data;
  } catch (error) {
    const apiError = error as ApiError;
    const errorMessage = apiError.response?.data?.message || apiError.message || 'Login failed. Please try again.';
    
    if (apiError.response?.status === 401) {
      toast.error('Invalid email or password');
    } else {
      toast.error(errorMessage);
    }
    
    throw new Error(errorMessage);
  }
};

export const register = async (
  username: string,
  email: string, 
  password: string, 
  confirmPassword: string,
  firstName?: string,
  lastName?: string,
  phoneNumber?: string
): Promise<AuthResponse> => {
  // Client-side validation
  if (password !== confirmPassword) {
    toast.error('Passwords do not match');
    throw new Error('Passwords do not match');
  }

  if (password.length < 6) {
    toast.error('Password must be at least 6 characters long');
    throw new Error('Password must be at least 6 characters long');
  }

  try {
    const response = await api.post<AuthResponse>('/auth/register', { 
      username,
      email, 
      password,
      firstName,
      lastName,
      phoneNumber
    });
    
    toast.success('Registration successful! Please log in.');
    return response.data;
  } catch (error) {
    const apiError = error as ApiError;
    const errorMessage = apiError.response?.data?.message || apiError.message || 'Registration failed. Please try again.';
    
    if (apiError.response?.status === 400) {
      if (errorMessage.toLowerCase().includes('email')) {
        toast.error('Email is already registered');
      } else if (errorMessage.toLowerCase().includes('password')) {
        toast.error('Invalid password format');
      } else {
        toast.error(errorMessage);
      }
    } else {
      toast.error(errorMessage);
    }
    
    throw new Error(errorMessage);
  }
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/user/me');
  return response.data;
};

export const updateUser = async (userData: Partial<User>): Promise<User> => {
  const response = await api.put<User>('/user/me', userData);
  return response.data;
};

export const logout = (): void => {
  // Note: In a real app, you might want to call a logout endpoint on the server
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default {
  login,
  register,
  getCurrentUser,
  updateUser,
  logout,
};
