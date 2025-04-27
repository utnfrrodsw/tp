// src/entities/autor.entity.ts
import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { Libro } from './libro.entity';

@Entity()
export class Autor {
  @PrimaryKey()
  id!: number;

  @Property()
  nombre!: string;

  @Property()
  apellido!: string;

  @OneToMany(() => Libro, libro => libro.autor)
  libros = new Collection<Libro>(this);
}
