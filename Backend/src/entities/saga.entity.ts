// src/entities/saga.entity.ts
import { Entity, PrimaryKey, Property, OneToMany, Collection, Unique } from '@mikro-orm/core';
import { Libro } from './libro.entity';

@Entity()
export class Saga {
  @PrimaryKey()
  id!: number;

  @Property()
  @Unique({ properties: ['nombre'] }) // evita sagas duplicadas
  nombre!: string;

  @OneToMany(() => Libro, libro => libro.saga)
  libros = new Collection<Libro>(this);

  @Property({ type: 'date', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ type: 'date', onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;
}
