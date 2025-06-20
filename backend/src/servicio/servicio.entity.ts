import { Entity, OneToMany, Property, Collection,Cascade, ManyToMany, OneToOne,PrimaryKey,Rel } from '@mikro-orm/core';
import { Tarea } from '../tarea/tarea.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { Turno } from '../turno/turno.entity.js';

@Entity()
export class Servicio   {
  @PrimaryKey()
  id!: number;
  @Property({nullable: false})
  precio!: number;

  @OneToOne(() => Tarea)
  tarea!: Rel<Tarea>;

  @ManyToMany(() => Usuario,(usuario) => usuario.servicios, { nullable: true, cascade: [Cascade.ALL] })
  usuarios = new Collection<Usuario>(this);

  @OneToMany(() => Turno, turno => turno.servicio, {cascade: [Cascade.ALL], nullable: true})
  turnos?: Rel<Turno>[];
}


