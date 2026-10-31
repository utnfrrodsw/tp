
import { API_URL } from '../../../config/api';

export interface RespuestaLogin { // Formato que espero recibir del backend al iniciar sesión
  message: string; // Mensaje de éxito o error
  token: string;
  user: { // Formato del usuario autenticado (es un objeto)
    id: number;
    nombre: string;
    email: string;
    rol: string;
    creado_en: string;
  };
}

export const iniciarSesionRequest = async (email: string, password: string): Promise<RespuestaLogin> => {

  const respuesta = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await respuesta.json();

  if (!respuesta.ok) { // Si la respuesta no es exitosa, tira un error con el mensaje recibido del backend
    throw new Error(data.error || 'Error al iniciar sesión');
  }

  return data;
};


// Función para registrar un nuevo usuario

export interface DatosRegistro { // Formato que espero que tenga el usuario que se va a registrar
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

export interface RespuestaRegistro { // Formato que espero recibir del backend al registrar un usuario
  message: string;
  token: string;
  user: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    creadoEn?: string;
  };
}

export const registrarUsuario = async (datos: DatosRegistro): Promise<RespuestaRegistro> => { // Esta función es asíncrona y, cuando termine, promete devolverme una RespuestaRegistro.
  const respuesta = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  const data = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(data.error || 'Error al registrar usuario');
  }

  return data;
};
