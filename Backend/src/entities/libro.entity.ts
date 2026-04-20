// src/entities/libro.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, ManyToMany, Collection, Index } from '@mikro-orm/core';
import { Categoria } from './categoria.entity';
import { Editorial } from './editorial.entity';
import { Autor } from './autor.entity';
import { Saga } from './saga.entity';
import { Resena } from './resena.entity';
import { ContenidoLista } from './contenidoLista.entity';
import { Favorito } from './favorito.entity';

@Entity()
export class Libro {
  @PrimaryKey()
  id!: number;

  @Property({ nullable: true })
  externalId?: string;

  @Property({ nullable: true })
  @Index() // permite búsquedas rápidas por nombre de libro
  nombre?: string;

  @Property({ nullable: true })
  @Index() // permite búsquedas rápidas por slug (URL-friendly)
  slug?: string;

  @Property({ type: 'text', nullable: true }) // sinopsis puede ser larga
  sinopsis?: string;

  @Property({ type: 'text', nullable: true })
  imagen?: string;

  @Property({ nullable: true })
  enlace?: string;

  @Property({ nullable: true })
  source?: string;

  @Property({ default: false })
  @Index()
  createdByAdmin?: boolean = false;

  @Property({ default: true })
  @Index()
  activo?: boolean = true;

  @Property({ type: 'date', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Autor, { nullable: true })
  autor?: Autor;

  @ManyToOne(() => Categoria, { nullable: true })
  categoria?: Categoria;

  @ManyToOne(() => Editorial, { nullable: true })
  editorial?: Editorial;

  @ManyToOne(() => Saga, { nullable: true })
  saga?: Saga;

  // Relaciones inversas
  @OneToMany(() => Resena, resena => resena.libro)
  resenas = new Collection<Resena>(this);

  @OneToMany(() => ContenidoLista, cl => cl.libro)
  contenidoListas = new Collection<ContenidoLista>(this);

  @OneToMany(() => Favorito, fav => fav.libro)
  favoritos = new Collection<Favorito>(this);

  // Auditoría
  @Property({ type: 'date', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ type: 'date', onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;
}
