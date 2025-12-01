import {
  Entity,
  Property,
  Rel,
  OneToOne,
  Cascade,
  Collection,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';
import { TipoServicio } from '../tipoServicio/tipoServ.entity.js';

@Entity()
export class Tarea extends BaseEntity {
  @Property({ nullable: false, unique: true })
  nombreTarea!: string;
  @Property({ nullable: false })
  descripcionTarea!: string;
  @Property({ nullable: false })
  duracionTarea!: number; // en minutos
  @OneToMany(() => Servicio, (servicio) => servicio.tarea, {
    nullable: true,
    cascade: [Cascade.ALL],
  })
  servicios = new Collection<Servicio>(this);
  @ManyToOne(() => TipoServicio, { nullable: false })
  tipoServicio!: Rel<TipoServicio>; // Relación con TipoServicio
}
