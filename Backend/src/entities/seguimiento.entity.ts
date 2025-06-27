// src/entities/seguimiento.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Usuario } from './usuario.entity';

@Entity()
export class Seguimiento {
  @PrimaryKey()
  id!: number;

  @ManyToOne()
  seguidor!: Usuario;

  @ManyToOne()
  seguido!: Usuario;

  @Property()
  fecha: Date = new Date();
}
