// src/entities/resena.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Libro } from './libro.entity';
import { Usuario } from './usuario.entity';

@Entity()
export class Resena {
  @PrimaryKey()
  id!: number;

  @Property()
  nombre!: string;

  @Property()
  fechaResena!: Date;

  @Property()
  comentario!: string;

  @Property()
  calificacion!: number; // Calificación entre 1-5

  @ManyToOne(() => Libro)
  libro!: Libro;

  @ManyToOne(() => Usuario)
  usuario!: Usuario;
}
