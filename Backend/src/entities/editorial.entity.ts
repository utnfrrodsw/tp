import { Entity, PrimaryKey, Property, OneToMany, Collection, Unique } from '@mikro-orm/core';
import { Libro } from './libro.entity';

@Entity()
export class Editorial {
  @PrimaryKey()
  id!: number;

  @Property()
  @Unique({ properties: ['nombre'] }) // evita duplicados
  nombre!: string;

  @OneToMany(() => Libro, libro => libro.editorial) // quitamos 'cascade' para evitar error TS
  libros = new Collection<Libro>(this);

  @Property({ type: 'date', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ type: 'date', onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;
}
