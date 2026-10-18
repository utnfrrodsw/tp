import type { EnumRol } from '@/types/types';

export interface LoginDto { username: string; password: string }
export interface RegisterDto { username: string; email: string; password: string; urlPicture?: string }
export interface ForgotPasswordDto { email: string }
export interface ResetPasswordDto { password: string }

export interface Me {
  id_user: string;
  userName: string;
  email: string;
  rol: EnumRol;
  urlPicture: string;
  status: boolean;
}

export interface MessageResponse { message: string }
