// src/entities/contenidoLista.entity.ts
import { Entity, PrimaryKey, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { Lista } from './lista.entity';
import { Libro } from './libro.entity';

@Entity()
@Unique({ properties: ['lista', 'libro'] }) // evita duplicados en la misma lista
export class ContenidoLista {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Lista)
  lista!: Lista;

  @ManyToOne(() => Libro)
  libro!: Libro;

  @Property({ nullable: true })
  orden?: number; // Para drag & drop y ordenamiento personalizado

  @Property({ type: 'date', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ type: 'date', onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;
}
