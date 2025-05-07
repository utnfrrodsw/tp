import { Entity, PrimaryKey, Property, OneToMany } from '@mikro-orm/core';
import { Libro } from './libro.entity';
import { Collection } from '@mikro-orm/core';  // Importar Collection

@Entity()
export class Categoria {
  @PrimaryKey()
  id!: number;

  @Property()
  nombre!: string;

  @OneToMany(() => Libro, libro => libro.categoria)
  libros = new Collection<Libro>(this);  // Usar Collection
}
