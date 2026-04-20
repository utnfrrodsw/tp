// src/services/sagaService.ts
import { API_BASE_URL } from '../config/api.config';

const API_URL = `${API_BASE_URL}/saga`;

export const getSagas = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('No se pudieron obtener las sagas');
  }
  return await response.json();
};

export const getSagaById = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('No se pudo obtener la saga');
  }
  return await response.json();
};

export const createSaga = async (sagaData: { nombre: string; libroIds: number[] }, token: string) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(sagaData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Error al crear la saga');
  }

  return await response.json();
};

export const updateSaga = async (id: number, sagaData: any, token: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(sagaData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Error al actualizar la saga');
  }

  return await response.json();
};

export const deleteSaga = async (id: number, token: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Error al eliminar la saga');
  }

  return await response.json();
};
