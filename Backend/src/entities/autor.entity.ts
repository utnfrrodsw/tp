// src/entities/autor.entity.ts
import { Entity, PrimaryKey, Property, OneToMany, Collection, Index, Cascade, Unique } from '@mikro-orm/core';
import { Libro } from './libro.entity';

@Entity()
@Unique({ properties: ['nombre', 'apellido'] })
export class Autor {
  @PrimaryKey()
  id!: number;

  @Property()
  @Index() // índice para búsquedas rápidas por nombre
  nombre!: string;

  @Property()
  @Index()
  apellido!: string;

  @Property({ length: 500, nullable: true })
  foto?: string; // URL de la foto del autor

  // --- Campos para IDs externos (evitar duplicados) ---
  @Property({ nullable: true, unique: true })
  @Index()
  googleBooksId?: string; // ID del autor en Google Books

  @Property({ nullable: true, unique: true })
  @Index()
  openLibraryKey?: string; // Key del autor en OpenLibrary (ej: /authors/OL23919A)

  @Property({ type: 'text', nullable: true })
  biografia?: string; // Biografía del autor (puede venir de las APIs)

  @Property({ default: false })
  @Index()
  createdByAdmin?: boolean = false;

  @Property({ default: true })
  @Index()
  activo?: boolean = true;

  @Property({ type: 'date', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => Libro, libro => libro.autor, { cascade: [Cascade.PERSIST, Cascade.REMOVE] })
  libros = new Collection<Libro>(this);

  @Property({ type: 'date', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ type: 'date', onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;
}
