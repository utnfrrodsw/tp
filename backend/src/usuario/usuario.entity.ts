<<<<<<< HEAD
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
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class Usuario extends BaseEntity {
  //*Atributos del Usuario
  @Property({ nullable: false })
  email!: string;

  @Property({ nullable: false })
  contrasena!: string;

  @Property({ nullable: false })
  tipoDoc!: string;
  @Property({ nullable: false })
  nroDoc!: string;
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
=======
import { Entity, Property, OneToOne , Cascade,Rel, ManyToMany, OneToMany, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';
import { Turno } from '../turno/turno.entity.js';
@Entity()
export class Usuario extends BaseEntity {
  //id 
  @Property({nullable: false})  
  mail!: string;
  @Property({nullable: false})
  contrasena!: string;
  @Property({nullable: false})
  tipoDoc!: string;
  @Property({nullable: false})
  numeroDoc!: number;
  // Este es un campo opcional de cliente
  @Property({nullable: true})
  telefono?: number;
  @Property({nullable: true})
  nombre?: string;
  @Property({nullable: true})
  apellido?: string;
  @Property({nullable: true})
  direccion?: string;
  // many to many
  // turno?  
  // Este es un campo opcional de prestatario
  @Property({nullable: true})
  nombreFantasia?: string;
  @Property({nullable: true})
  descripcion?: string;
  @Property({nullable: true})
  foto?: string; // aca se pone la ruta de la foto
  @ManyToMany(() => Servicio,(servicio) => servicio.usuarios, { cascade: [Cascade.ALL], owner: true, nullable: true })
  servicios =  new Collection<Servicio>(this);
  @OneToMany(() => Turno, turno => turno.usuario, {cascade: [Cascade.ALL], nullable: true})
  turnos = new Collection<Turno>(this);
>>>>>>> origin/luis
}
