import {
  Entity,
  Property,
  OneToOne,
  PrimaryKey,
  Cascade,
  ManyToOne,
  Rel,
} from '@mikro-orm/core';
import { Usuario } from '../usuario/usuario.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';

@Entity()
export class Turno {
  @PrimaryKey()
  fecha!: Date;
  @PrimaryKey()
  hora!: string;
  @Property()
  estado!: string;
  @Property()
  calificacion?: number;
  @Property()
  comentario?: string;
  @Property()
  montoFinal?: number;
  @Property()
  fechaPago?: Date;
  @ManyToOne(() => Servicio, { cascade: [Cascade.ALL], nullable: true })
  servicio?: Rel<Servicio>;

  @ManyToOne(() => Usuario, { cascade: [Cascade.ALL], nullable: true })
  usuario?: Rel<Usuario>;
}
