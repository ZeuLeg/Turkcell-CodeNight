import { create } from 'zustand';
import { BackendRole } from '@/types/user.types';

export type UserRole = 'admin' | 'manager' | 'operator' | 'field_engineer';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
}

export function mapBackendRole(backendRole: BackendRole): { role: UserRole; roleLabel: string } {
  switch (backendRole) {
    case 'ADMIN':
      return { role: 'admin', roleLabel: 'Sistem Yöneticisi' };
    case 'NOC':
      return { role: 'operator', roleLabel: 'NOC Operatörü' };
    case 'FIELD_ENGINEER':
      return { role: 'field_engineer', roleLabel: 'Saha Mühendisi' };
    case 'MANAGER':
      return { role: 'manager', roleLabel: 'Şebeke Yöneticisi' };
    default:
      return { role: 'operator', roleLabel: 'Operatör' };
  }
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isMockMode: boolean;
  login: (token: string, user: AuthUser, refreshToken?: string) => void;
  logout: () => void;
  setMockMode: (mockMode: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token') || null,
  user: (() => {
    try { return JSON.parse(localStorage.getItem('auth_user') || 'null'); } catch { return null; }
  })(),
  isAuthenticated: !!localStorage.getItem('token'),
  isMockMode: false,
  login: (token: string, user: AuthUser, refreshToken?: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    set({ token, isAuthenticated: true, user });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('auth_user');
    set({ token: null, isAuthenticated: false, user: null });
  },
  setMockMode: (isMockMode: boolean) => set({ isMockMode }),
}));
