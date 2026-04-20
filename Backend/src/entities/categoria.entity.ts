// src/entities/categoria.entity.ts
import { Entity, PrimaryKey, Property, OneToMany, Collection, Index, Unique, Cascade } from '@mikro-orm/core';
import { Libro } from './libro.entity';

@Entity()
export class Categoria {
  @PrimaryKey()
  id!: number;

  @Property()
  @Index() // permite búsquedas rápidas
  @Unique() // evita categorías duplicadas
  nombre!: string;

  @Property({ nullable: true })
  descripcion?: string;

  @Property({ nullable: true })
  imagen?: string;

  @OneToMany(() => Libro, libro => libro.categoria, { cascade: [Cascade.PERSIST] })
  libros = new Collection<Libro>(this);

  @Property({ type: 'date', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ type: 'date', onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;
}
