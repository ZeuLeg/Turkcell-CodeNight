import { create } from 'zustand';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isMockMode: boolean;
  login: (token: string) => void;
  logout: () => void;
  setMockMode: (mockMode: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isMockMode: true, // Default to mock mode as requested
  login: (token: string) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAuthenticated: false });
  },
  setMockMode: (isMockMode: boolean) => set({ isMockMode }),
}));
