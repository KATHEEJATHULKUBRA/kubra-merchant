import { apiRequest } from './queryClient';
import { User } from '@shared/schema';

// Types
export interface AuthUser extends Omit<User, 'password'> {}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
}

// Auth functions
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const res = await apiRequest('POST', '/api/auth/login', credentials);
  const data = await res.json();
  
  // Store token in localStorage
  localStorage.setItem('auth_token', data.token);
  
  return data;
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  const res = await apiRequest('POST', '/api/auth/register', credentials);
  const data = await res.json();
  
  // Store token in localStorage
  localStorage.setItem('auth_token', data.token);
  
  return data;
}

export function logout(): void {
  localStorage.removeItem('auth_token');
}

export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const res = await apiRequest('GET', '/api/me');
    return await res.json();
  } catch (error) {
    return null;
  }
}
