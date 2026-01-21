import { UsuarioRol } from '../entities/Usuario';

export interface AuthUser {
  id: number;
  rol: UsuarioRol;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user: AuthUser; // ✅ SIN "?" - obligatorio (elimina TODOS los errores)
    }
  }
}