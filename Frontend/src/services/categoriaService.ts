import { API_BASE_URL } from '../config/api.config';

export const getCategorias = async () => {
    const response = await fetch(`${API_BASE_URL}/categoria`);
    if (!response.ok) {
      throw new Error('No se pudieron obtener las categorías');
    }
    return await response.json();
  };
  