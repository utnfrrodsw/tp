// src/entities/resena.entity.ts
import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  Enum,
} from '@mikro-orm/core';
import { Usuario } from './usuario.entity';
import { Libro } from './libro.entity';
import { Reaccion } from './reaccion.entity';

export enum EstadoResena {
  PENDING = 'pending',
  APPROVED = 'approved',
  FLAGGED = 'flagged',
  REJECTED = 'rejected',
}

@Entity()
export class Resena {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Property({ type: 'text' })
  comentario!: string;

  @Property()
  estrellas!: number; // validar rango 0–5 en servicio antes de persistir

  @Enum(() => EstadoResena)
  estado: EstadoResena = EstadoResena.PENDING;

  // Campos de moderación automática
  @Property({ nullable: true })
  moderationScore?: number; // Score de 0-100 del análisis automático

  @Property({ type: 'text', nullable: true })
  moderationReasons?: string; // Razones del sistema de moderación (JSON string)

  @Property({ nullable: true })
  autoModerated?: boolean; // Si fue moderada automáticamente

  @Property({ nullable: true })
  autoRejected?: boolean; // Si fue rechazada automáticamente por el sistema

  @Property({ type: 'text', nullable: true })
  rejectionReason?: string; // Razón del rechazo automático

  @Property({ type: 'date', onCreate: () => new Date() })
  fechaResena!: Date;

  @Property({ type: 'date', nullable: true })
  deletedAt?: Date; // Soft delete - fecha de eliminación

  @ManyToOne(() => Usuario, { nullable: false })
  usuario!: Usuario;

  @ManyToOne(() => Libro, { nullable: false })
  libro!: Libro;

  @OneToMany(() => Reaccion, (reaccion) => reaccion.resena)
  reacciones = new Collection<Reaccion>(this);

  // Self-referencing for nested replies
  @ManyToOne(() => Resena, { nullable: true, deleteRule: 'cascade' })
  resenaPadre?: Resena;

  @OneToMany(() => Resena, (child) => child.resenaPadre)
  respuestas = new Collection<Resena>(this);

  @Property({ type: 'date', onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ type: 'date', onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;
}
