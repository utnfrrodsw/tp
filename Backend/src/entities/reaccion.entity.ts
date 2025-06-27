// src/entities/reaccion.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Usuario } from './usuario.entity';
import { Resena } from './resena.entity';

@Entity()
export class Reaccion {
  @PrimaryKey()
  id!: number;

  @Property()
  tipo!: string;  // ej: 'like', 'dislike', 'emoji_❤️'

  @ManyToOne()
  usuario!: Usuario;

  @ManyToOne()
  resena!: Resena;

  @Property()
  fecha: Date = new Date();
}
