import {
  Entity,
  Property,
  Cascade,
  ManyToOne,
  Rel,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { Usuario } from '../usuario/usuario.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Pago } from '../pago/pago.entity.js';

@Entity()
export class Turno extends BaseEntity {
  @Property({ nullable: false })
  fechaHora!: Date;
  @Property({ nullable: false })
  estado!: string;
  @Property({ nullable: true })
  calificacion?: number;
  @Property({ nullable: true })
  comentario?: string;
  @Property({ nullable: true })
  montoFinal!: number;
  @ManyToOne(() => Servicio, { nullable: true })
  servicio!: Rel<Servicio>;

  @ManyToOne(() => Usuario, { cascade: [Cascade.PERSIST], nullable: true })
  usuario!: Rel<Usuario>;

  @OneToMany(() => Pago, (pago) => pago.turno)
  pagos = new Collection<Pago>(this);
}
