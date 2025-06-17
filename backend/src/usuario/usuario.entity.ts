import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  ManyToOne,
  Rel,
  PrimaryKey,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { CharacterClass } from './characterClass.entity.js';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class Character extends BaseEntity {
  @PrimaryKey({ nullable: false })
  id = uuidv4();

  /*   @ManyToOne(() => CharacterClass, { nullable: false })
  characterClass!: Rel<CharacterClass>; */
  //*Atributos del Usuario
  @Property({ nullable: false })
  email!: string;

  @Property({ nullable: false })
  contrasena!: string;

  @Property({ nullable: false })
  mana!: number;

  @Property({ nullable: false })
  tipoDoc!: string;
  @Property({ nullable: false })
  nroDoc!: number;
  @Property({ nullable: false })
  direccion!: string;

  //*Atributos del cliente
  @Property({ nullable: true })
  telefono?: number;
  @Property({ nullable: true })
  nombre?: string;
  @Property({ nullable: true })
  apellido?: string;
  @Property({ nullable: true })
  fechaNacimiento?: Date;

  //*Atributos del Prestatario

  @Property({ nullable: true })
  nombreFantasia?: string;
  @Property({ nullable: true })
  descripcion?: string;
}
