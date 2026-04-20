// src/services/actividadService.ts
import { API_BASE_URL } from '../config/api.config';

const API_URL = `${API_BASE_URL}/actividades`;

export const getActividades = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('No se pudieron obtener las actividades');
  }
  return await response.json();
};

export const getActividadById = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('No se pudo obtener la actividad');
  }
  return await response.json();
};

export const getActividadesByUsuario = async (usuarioId: number) => {
  const response = await fetch(`${API_URL}/usuario/${usuarioId}`);
  if (!response.ok) {
    throw new Error('No se pudieron obtener las actividades del usuario');
  }
  return await response.json();
};



export const createActividad = async (actividadData: any, token: string) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(actividadData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Error al crear la actividad');
  }

  return await response.json();
};

export const deleteActividad = async (id: number, token: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Error al eliminar la actividad');
  }

  return await response.json();
};
