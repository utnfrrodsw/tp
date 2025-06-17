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
  // Este es un campo opcional de cliente
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
  // Este es un campo opcional de prestatario
  @Property()
  nombreFantasia?: string;
  @Property()
  descripcion?: string;
  @Property()
  foto?: string; // aca se pone la ruta de la foto
  //many to many
  // @ManyToMany(() => Tarea, { nullable: true, cascade: [Cascade.ALL] })
  // tareas?: Rel<Tarea>
}
