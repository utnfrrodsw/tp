import { API_URL } from '../../../config/api';

export interface Servicio {
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

export interface Empresa {
  id: number;
  nombre: string;
  zona?: string;
  telefono?: number;
}


// Trae las empresas activas para el autocompletado del buscador
export const listEmpresasRequest = async (): Promise<Empresa[]> => {

  const response = await fetch(`${API_URL}/api/usuarios/empresas`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || 'Error al obtener las empresas'
    );
  }

  return data.empresas;
};


// Busca servicios filtrando por nombre, zona y/o empresa
export const buscarServiciosRequest = async (
  nombre: string,
  zona = '',
  empresa = ''
): Promise<Servicio[]> => {

  const params = new URLSearchParams();
  if (nombre.trim()) params.set('nombre', nombre.trim());
  if (zona.trim()) params.set('zona', zona.trim());
  if (empresa.trim()) params.set('empresa', empresa.trim());

  const response = await fetch(
    `${API_URL}/api/servicios/buscar?${params.toString()}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || 'Error al buscar los servicios'
    );
  }

  return data.servicios;
};


// Busca servicios que pertenezcan a una categoría
export const buscarServiciosPorCategoriaRequest = async (
  categoriaId: number
): Promise<Servicio[]> => {

  const response = await fetch(
    `${API_URL}/api/servicios/categoria/${categoriaId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || 'Error al buscar los servicios por categoría'
    );
  }

  return data.servicios;
};