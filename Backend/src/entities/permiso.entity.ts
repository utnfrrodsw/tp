// src/entities/permiso.entity.ts
import { Entity, PrimaryKey, Property, Enum } from '@mikro-orm/core';

export enum TipoPermiso {
  MODERAR_RESEÑA = 'moderar_resena',
  ELIMINAR_USUARIO = 'eliminar_usuario',
  GESTIONAR_LIBRO = 'gestionar_libro',
  // agregar más según necesidad
}

@Entity()
export class Permiso {
  @PrimaryKey()
  id!: number;

  @Enum(() => TipoPermiso)
  tipo!: TipoPermiso;

  @Property()
  descripcion!: string;
}
