// Constantes para nombres y tipos de listas
// Esto previene inconsistencias entre diferentes componentes

export const LISTA_NOMBRES = {
  READ: 'Leídos',
  TO_READ: 'Ver más tarde',
  PENDING: 'Pendiente'
} as const;

export const LISTA_TIPOS = {
  READ: 'read',
  TO_READ: 'to_read',
  PENDING: 'pending',
  CUSTOM: 'custom'
} as const;

export type ListaTipo = typeof LISTA_TIPOS[keyof typeof LISTA_TIPOS];

// Mapeo de tipo a nombre
export const TIPO_TO_NOMBRE: Record<string, string> = {
  [LISTA_TIPOS.READ]: LISTA_NOMBRES.READ,
  [LISTA_TIPOS.TO_READ]: LISTA_NOMBRES.TO_READ,
  [LISTA_TIPOS.PENDING]: LISTA_NOMBRES.PENDING,
};

// Mapeo de nombre a tipo
export const NOMBRE_TO_TIPO: Record<string, string> = {
  [LISTA_NOMBRES.READ]: LISTA_TIPOS.READ,
  [LISTA_NOMBRES.TO_READ]: LISTA_TIPOS.TO_READ,
  [LISTA_NOMBRES.PENDING]: LISTA_TIPOS.PENDING,
};

// Helper para obtener nombre por tipo
export const getNombreLista = (tipo: string): string => {
  return TIPO_TO_NOMBRE[tipo] || tipo;
};

// Helper para obtener tipo por nombre
export const getTipoLista = (nombre: string): string => {
  return NOMBRE_TO_TIPO[nombre] || LISTA_TIPOS.CUSTOM;
};
