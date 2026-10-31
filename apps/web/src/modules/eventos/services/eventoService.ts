import { API_URL } from '../../../config/api';

export interface Evento {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  draft: boolean;
  creadoEn?: string;
}

export interface EventoPayload {
  nombre: string;
  descripcion?: string;
  imagen?: string;
  draft?: boolean;
}

export const listEventosRequest = async (token: string): Promise<Evento[]> => {
  const response = await fetch(`${API_URL}/api/eventos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al obtener los eventos');
  }

  return data.eventos;
};

export const createEventoRequest = async (payload: EventoPayload, token: string): Promise<Evento> => {
  const response = await fetch(`${API_URL}/api/eventos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al crear el evento');
  }

  return data.evento;
};

export const updateEventoRequest = async (id: number, payload: Partial<EventoPayload>, token: string): Promise<Evento> => {
  const response = await fetch(`${API_URL}/api/eventos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al actualizar el evento');
  }

  return data.evento;
};

export const deleteEventoRequest = async (id: number, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/eventos/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Error al eliminar el evento');
  }
};
