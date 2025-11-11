import axios from 'axios';

const API_URL = '/api';

interface User {
  id: number;
  name: string;
  email: string;
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
  const response = await api.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
};

export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', { name, email, password });
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/user');
  return response.data;
};

export const updateUser = async (userData: Partial<User>): Promise<User> => {
  const response = await api.put<User>('/user', userData);
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
