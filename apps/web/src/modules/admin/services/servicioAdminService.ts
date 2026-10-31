import { API_URL } from '../../../config/api';

// Mismo tipo que usa la empresa: el admin ve los servicios que estan en revision
export interface ServicioRevision {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  estado: 'borrador' | 'revision' | 'publicado';
  creadoEn?: string;
  categoria: {
    id: number;
    nombre: string;
  };
  empresa: {
    id: number;
    nombre: string;
    telefono?: number;
    zona?: string;
  };
}

// Trae todos los servicios que las empresas mandaron a revisar
export const listServiciosRevisionRequest = async (token: string): Promise<ServicioRevision[]> => {
  const response = await fetch(`${API_URL}/api/servicios/admin/revision`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al obtener los servicios en revision');
  }

  return data.servicios;
};

// Aprueba un servicio en revision: queda publicado
export const aprobarServicioRequest = async (id: number, token: string): Promise<ServicioRevision> => {
  const response = await fetch(`${API_URL}/api/servicios/admin/${id}/aprobar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al aprobar el servicio');
  }

  return data.servicio;
};

// Deniega un servicio en revision: se borra directamente
export const denegarServicioRequest = async (id: number, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/servicios/admin/${id}/denegar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Error al denegar el servicio');
  }
};
