// src/entities/actividad.entity.ts
import { Entity, PrimaryKey, ManyToOne, Property, Enum } from '@mikro-orm/core';
import { Usuario } from './usuario.entity';
import { Libro } from './libro.entity';
import { Resena } from './resena.entity';

export enum TipoActividad {
  RESEÑA = 'resena',
  RESPUESTA = 'respuesta',
  FAVORITO = 'favorito',
  SEGUIMIENTO = 'seguimiento',
  LISTA = 'lista',
  REACCION = 'reaccion',
}

@Entity()
export class Actividad {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Usuario, { nullable: false })
  usuario!: Usuario;

  @Enum(() => TipoActividad)
  tipo!: TipoActividad;

  // referencia opcional según tipo de actividad
  @ManyToOne(() => Libro, { nullable: true })
  libro?: Libro;

  @ManyToOne(() => Resena, { nullable: true })
  resena?: Resena;

  @Property({ type: 'datetime', onCreate: () => new Date() })
  fecha: Date = new Date();
}
