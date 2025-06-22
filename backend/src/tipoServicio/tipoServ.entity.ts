import { Entity, Property, Cascade, ManyToMany } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
//import { Tarea } from './../tarea.entity.js'
@Entity()
export class TipoServicio extends BaseEntity {
  @Property({ nullable: false })
  nombreTipo!: string;

  @Property({ nullable: false })
  descripcionTipo!: string;

  @ManyToMany(() => Usuario, usuario => usuario.tiposServicio, {
    cascade: [Cascade.ALL],
    owner: true, // Por el momento ponemos que es el owner. Pero es debatible
    nullable: true,
  })
  usuarios!: Usuario[];

  /*   @OneToMany(()=>Tarea , (tarea)=> tarea.tipoServicio,{
    cascade:[Cascade.ALL],
  })
  tareas!: Tarea[] */
}
