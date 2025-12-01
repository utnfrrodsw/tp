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

@Entity()
export class TipoServicio extends BaseEntity {
  @Property({ nullable: false, unique: true })
  nombreTipo!: string;

  @Property({ nullable: false })
  descripcionTipo!: string;

  @ManyToMany(() => Usuario, (user) => user.tiposDeServicio, {
    mappedBy: 'tiposDeServicio',
  })
  users = new Collection<Usuario>(this);

  @OneToMany(() => Tarea, (tarea) => tarea.tipoServicio, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
    nullable: true,
  })
  tareas = new Collection<Tarea>(this);
}
