// src/entities/reaccion.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne, Unique, Enum } from '@mikro-orm/core';
import { Usuario } from './usuario.entity';
import { Resena } from './resena.entity';

export enum TipoReaccion {
  LIKE = 'like',
  DISLIKE = 'dislike',
  CORAZON = 'corazon',
  // podés agregar más tipos de reacciones
}

@Entity()
@Unique({ properties: ['usuario', 'resena'] }) // un usuario solo puede reaccionar una vez por reseña
export class Reaccion {
  @PrimaryKey()
  id!: number;

  @Enum(() => TipoReaccion)
  tipo!: TipoReaccion;

  @ManyToOne(() => Usuario, { nullable: false })
  usuario!: Usuario;

  @ManyToOne(() => Resena, { nullable: false })
  resena!: Resena;

  @Property({ type: 'date', onCreate: () => new Date() })
  fecha: Date = new Date();

  @Property({ type: 'date', onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;
}
