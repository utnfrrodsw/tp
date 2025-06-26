import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { Libro } from './libro.entity';

@Entity()
export class Saga {
  @PrimaryKey()
  id!: number;

  @Property()
  nombre!: string;

  @OneToMany(() => Libro, libro => libro.saga)
  libros = new Collection<Libro>(this);
}
