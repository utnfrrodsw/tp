export interface CreateEventoDto {
  nombre: string;
  descripcion?: string;
  imagen?: string;
  draft?: boolean;
}

export interface UpdateEventoDto {
  nombre?: string;
  descripcion?: string;
  imagen?: string;
  draft?: boolean;
}
