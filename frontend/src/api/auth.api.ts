import { api } from './client';
import { BackendUser } from '@/types/user.types';

interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: BackendUser;
}

interface RegisterResponse {
  success: boolean;
  token: string;
  data: BackendUser;
}

interface OtpRequestResponse {
  success: boolean;
  message: string;
  otp?: string; // sadece geliştirme ortamında döner
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/api/v1/auth/login', { email, password }),

  register: (email: string, password: string, role: string) =>
    api.post<RegisterResponse>('/api/v1/auth/register', { email, password, role }),

  requestOtp: (phone: string) =>
    api.post<OtpRequestResponse>('/api/v1/auth/request-otp', { phone }),

  verifyOtp: (phone: string, otp: string) =>
    api.post<LoginResponse>('/api/v1/auth/verify-otp', { phone, otp }),
};
