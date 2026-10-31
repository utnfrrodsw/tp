export interface CreateCategoriaDto {
  nombre: string;
  descripcion?: string;
  eventoId: number;
}

export interface UpdateCategoriaDto {
  nombre?: string;
  descripcion?: string;
  eventoId?: number;
}
