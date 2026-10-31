import { API_URL } from '../../../config/api';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  zona?: string;
  cuit?: number;
  telefono?: number;
  activo: boolean;
  creadoEn?: string;
}
// Función para obtener la lista de usuarios según el rol
export const listUsuariosRequest = async (rol: string | undefined, token: string): Promise<Usuario[]> => {
  const query = rol ? `?rol=${encodeURIComponent(rol)}` : ''; 
  const response = await fetch(`${API_URL}/api/usuarios${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al obtener los usuarios');
  }

  return data.usuarios;
};

export const setUsuarioActivoRequest = async (id: number, activo: boolean, token: string): Promise<Usuario> => {
  const response = await fetch(`${API_URL}/api/usuarios/${id}/activo`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ activo }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al actualizar el usuario');
  }

  return data.usuario;
};
