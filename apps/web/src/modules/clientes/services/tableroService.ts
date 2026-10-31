import type { Servicio } from './servicioService';
import { API_URL } from '../../../config/api';

const TABLEROS_URL = `${API_URL}/api/tableros`;

export interface Tablero {
  id: number;
  nombre: string;
  evento: { id: number; nombre: string } | null;
  fechaCreacion: string;
  servicios: Servicio[];
}

export async function listTableros(token: string): Promise<Tablero[]> {
  const response = await fetch(TABLEROS_URL, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al gestionar el tablero');
  return data.tableros;
}

export async function createTablero(token: string, nombre: string, eventoId: number): Promise<Tablero> {
  const response = await fetch(TABLEROS_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, eventoId })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al gestionar el tablero');
  return data.tablero;
}

export async function updateTablero(token: string, id: number, nombre: string, eventoId: number): Promise<Tablero> {
  const response = await fetch(`${TABLEROS_URL}/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, eventoId })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al gestionar el tablero');
  return data.tablero;
}

export async function deleteTablero(token: string, id: number): Promise<void> {
  const response = await fetch(`${TABLEROS_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (response.status === 204) return;
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al gestionar el tablero');
}

export async function addServicio(token: string, id: number, servicioId: number): Promise<void> {
  const response = await fetch(`${TABLEROS_URL}/${id}/servicios`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ servicioId })
  });
  if (response.status === 204) return;
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al gestionar el tablero');
}

export async function removeServicio(token: string, id: number, servicioId: number): Promise<void> {
  const response = await fetch(`${TABLEROS_URL}/${id}/servicios/${servicioId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (response.status === 204) return;
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al gestionar el tablero');
}
