import {
  Entity,
  Property,
  Rel,
  OneToOne,
  Cascade,
  Collection,
  ManyToMany,
  ManyToOne,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';
import { TipoServicio } from '../tipoServicio/tipoServ.entity.js';

@Entity()
export class Tarea extends BaseEntity {
  @Property({ nullable: false })
  nombreTarea!: string;
  @Property({ nullable: false })
  descripcionTarea!: string;
  @Property({ nullable: false })
  duracionTarea!: number;
  @OneToOne(() => Servicio, (servicio) => servicio.tarea, {
    nullable: true,
    cascade: [Cascade.ALL],
  })
  servicio?: Rel<Servicio>;
  @ManyToOne(() => TipoServicio, {
    nullable: false,
    cascade: [Cascade.PERSIST],
  })
  tipoServicio!: Rel<TipoServicio>;
}
