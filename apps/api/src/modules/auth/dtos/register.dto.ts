export interface RegisterDto {
  nombre: string;
  email: string;
  password: string;
  confirmarContrasena: string;
  aceptaTerminos: boolean;
  role: 'cliente' | 'empresa';
  zona?: string;
  cuit?: number;
  telefono?: number;
}
