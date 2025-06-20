import { Entity, OneToMany, Property, Collection,Cascade, ManyToMany, OneToOne } from '@mikro-orm/core';
import { Tarea } from '../tarea/tarea.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { Turno } from '../turno/turno.entity.js';

@Entity()
export class Servicio   {

  @Property({nullable: false})
  precio!: number;

  @OneToOne(() => Tarea, (tarea) => tarea.servicio, { nullable: true, cascade: [Cascade.ALL] })
  tarea?: Tarea;

  @ManyToMany(() => Usuario,(usuario) => usuario.servicios, { nullable: true, cascade: [Cascade.ALL] })
  usuarios = new Collection<Usuario>(this);

  @OneToMany(() => Turno, turno => turno.servicio, {cascade: [Cascade.ALL], nullable: true})
  turnos = new Collection<Turno>(this);
}


