//axios es una librería que permite hacer peticiones HTTP
import axios from 'axios';
const token = localStorage.getItem('token');
// El puerto del backend donde quiere hacer las peticiones
// Como las variables de env son siempre string, tiene que comparar si es igual a 'true', entonces almacena el booleano de js
const local = import.meta.env.VITE_LOCAL === 'true';
export const API_BASE_URL = local
  ? 'http://localhost:3000/api'
  : 'https://backend-nameless-dream-346.fly.dev/api';

console.log('API_BASE_URL:', API_BASE_URL);
// ====== INTERFACES Y TIPOS ======

/**
 * Interfaz flexible para representar cualquier entidad con propiedades dinámicas
 * Permite que un objeto tenga cualquier cantidad de propiedades con cualquier tipo de valor
 */
export interface EntityData {
  [key: string]: unknown;
}

// ====== CONFIGURACIÓN DE AXIOS ======
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

// ====== INTERCEPTORES ======

/**
 * Interceptor de respuestas: Maneja automáticamente todas las respuestas del servidor
 * - Si la respuesta es exitosa: la retorna sin modificaciones
 * - Si hay un error: lo registra en consola y rechaza la promesa para manejo posterior
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la petición:', error);
    return Promise.reject(error);
  }
);
