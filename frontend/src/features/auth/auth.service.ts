import { http } from '@/lib/http';
import type {
  LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto, Me, MessageResponse,
} from './types';

const BASE = 'auth';

export const authService = {
  login: (data: LoginDto) => http.post<MessageResponse>(`${BASE}/login`, data),
  register: (data: RegisterDto) => http.post<MessageResponse>(`${BASE}/register`, data),
  logout: () => http.post<MessageResponse>(`${BASE}/logout`),
  me: (signal?: AbortSignal) => http.get<Me>(`${BASE}/me`, { signal }),
  forgotPassword: (data: ForgotPasswordDto) =>
    http.post<MessageResponse>(`${BASE}/forgot-password`, data),
  resetPassword: (token: string, data: ResetPasswordDto) =>
    http.post<MessageResponse>(`${BASE}/reset-password/${token}`, data),
  validateAccount: (token: string) =>
    http.put<{ success: boolean; message: string }>(`${BASE}/validate/${token}`),
};
