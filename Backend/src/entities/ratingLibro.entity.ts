// src/entities/ratingLibro.entity.ts
import { Entity, PrimaryKey, ManyToOne, Property } from '@mikro-orm/core';
import { Libro } from './libro.entity';

@Entity()
export class RatingLibro {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Libro, { nullable: false })
  libro!: Libro;

  @Property({ type: 'float' })
  avgRating!: number;

  @Property()
  cantidadResenas!: number;

  @Property({ type: 'date', onCreate: () => new Date() })
  fechaActualizacion: Date = new Date();
}
