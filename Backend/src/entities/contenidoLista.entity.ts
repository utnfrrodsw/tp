// src/entities/contenidoLista.entity.ts
import { Entity, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { Lista } from './lista.entity';
import { Libro } from './libro.entity';

@Entity()
export class ContenidoLista {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Lista)
  lista!: Lista;

  @ManyToOne(() => Libro)
  libro!: Libro;
}
