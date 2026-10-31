// El estado lo puede mandar la empresa como 'borrador' o 'revision'.
// 'publicado' solo lo pone el administrador cuando aprueba el servicio.
export type EstadoServicio = 'borrador' | 'revision' | 'publicado';

export interface CreateServicioDto {
  nombre: string;
  descripcion?: string;
  imagen?: string;
  categoriaId: number;
  usuarioId: number;
  estado?: EstadoServicio;
}

export interface UpdateServicioDto {
  nombre?: string;
  descripcion?: string;
  imagen?: string;
  categoriaId?: number;
  estado?: EstadoServicio;
}
