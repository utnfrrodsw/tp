import {
  Entity,
  OneToMany,
  Property,
  Cascade,
  PrimaryKey,
  Rel,
  ManyToOne,
} from '@mikro-orm/core';
import { Tarea } from '../tarea/tarea.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { Turno } from '../turno/turno.entity.js';

@Entity()
export class Servicio {
  @PrimaryKey()
  id!: number;

  @Property({ nullable: false })
  estado!: 'activo' | 'inactivo';

  @Property({ nullable: false })
  precio!: number;

  @ManyToOne(() => Tarea, { nullable: false })
  tarea!: Rel<Tarea>;

  @ManyToOne(() => Usuario, {
    nullable: true,
  })
  usuario!: Rel<Usuario>;

  @OneToMany(() => Turno, (turno) => turno.servicio, {
    cascade: [Cascade.ALL],
    nullable: true,
  })
  turnos?: Rel<Turno>[];
}
