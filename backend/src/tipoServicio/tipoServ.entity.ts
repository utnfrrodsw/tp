import {
  Cascade,
  Collection,
  Entity,
  Property,
  ManyToMany,
  OneToMany,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { Tarea } from '../tarea/tarea.entity.js';
//import { Usuario } from './../usuario.entity.js'
//import { Tarea } from './../tarea.entity.js'
@Entity()
export class TipoServicio extends BaseEntity {
  @Property({ nullable: false })
  nombreTipo!: string;

  @Property({ nullable: false })
  descripcionTipo!: string;

  @ManyToMany(() => Usuario, (user) => user.services, {
    cascade: [Cascade.ALL],
    owner: true, //*Por el momento ponemos que es el owner. Pero es debatible
  })
  users = new Collection<Usuario>(this);

  @OneToMany(() => Tarea, (tarea) => tarea.tipoServicio, {
    cascade: [Cascade.ALL],
  })
  tareas = new Collection<Tarea>(this);
}
