import { Entity, Property, ManyToOne, Cascade } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity';
export abstract class Usuario extends BaseEntity {
  //id 
  @Property()  
  mail!: string;
  @Property()
  contrasena!: string;
  @Property()
  tipoDoc!: string;
  @Property()
  numeroDoc!: number;

}

@Entity()
export class Cliente extends Usuario {
  @Property()
  telefono?: number;
  @Property()
  nombre?: string;
  @Property()
  apellido?: string;
  @Property()
  direccion?: string;
  // many to many
  // turno?  
}

@Entity()
export class Prestatario extends Usuario {
  @Property()
  nombreFantasia?: string;
  @Property()
  descripcion?: string;
  @Property()
  foto?: string; // aca se pone la ruta de la foto
  //many to many
  //Tarea
}
