import { create } from 'zustand';

export type UserRole = 'admin' | 'manager' | 'operator';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isMockMode: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  setMockMode: (mockMode: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token') || null,
  user: (() => {
    try { return JSON.parse(localStorage.getItem('auth_user') || 'null'); } catch { return null; }
  })(),
  isAuthenticated: !!localStorage.getItem('token'),
  isMockMode: true,
  login: (token: string, user: AuthUser) => {
    localStorage.setItem('token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    set({ token, isAuthenticated: true, user });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_user');
    set({ token: null, isAuthenticated: false, user: null });
  },
  setMockMode: (isMockMode: boolean) => set({ isMockMode }),
}));
