import {
  Entity,
  Property,
  Rel,
  OneToOne,
  Cascade,
  Collection,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';

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
}
