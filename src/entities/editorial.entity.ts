import { Entity, PrimaryKey, Property, OneToMany } from '@mikro-orm/core';
import { Libro } from './libro.entity';
import { Collection } from '@mikro-orm/core';  // Importar Collection

@Entity()
export class Editorial {
  @PrimaryKey()
  id!: number;

  @Property()
  nombre!: string;

  @OneToMany(() => Libro, libro => libro.editorial)
  libros = new Collection<Libro>(this);  // Usar Collection
}
