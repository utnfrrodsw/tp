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
  @Property({ nullable: false, unique: true })
  nombreTarea!: string;
  @Property({ nullable: false })
  descripcionTarea!: string;
  @Property({ nullable: false })
  duracionTarea!: number; // en minutos
  @OneToOne(() => Servicio, (servicio) => servicio.tarea, {
    nullable: true,
    cascade: [Cascade.ALL],
  })
  servicio?: Rel<Servicio>;
  @ManyToOne(() => TipoServicio, {
    nullable: false,
    //cascade: [Cascade.PERSIST], //Esto nos va a permitir que al crear una tarea, se cree el tipo de servicio si no existeHHHH
  })
  tipoServicio!: Rel<TipoServicio>;
}
