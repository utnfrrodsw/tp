// src/entities/seguimiento.entity.ts
import { Entity, PrimaryKey, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { Usuario } from './usuario.entity';

@Entity()
@Unique({ properties: ['seguidor', 'seguido'] }) // evita duplicados: un usuario no puede seguir dos veces al mismo
export class Seguimiento {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Usuario, { nullable: false })
  seguidor!: Usuario;

  @ManyToOne(() => Usuario, { nullable: false })
  seguido!: Usuario;

  @Property({ type: 'date', onCreate: () => new Date() })
  fechaSeguido: Date = new Date();

  @Property({ type: 'date', onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;
}
