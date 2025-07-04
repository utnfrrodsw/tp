import {
  Entity,
  Property,
  Cascade,
  ManyToOne,
  Rel,

} from '@mikro-orm/core';
import { Usuario } from '../usuario/usuario.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class Turno extends BaseEntity {
  @Property({nullable: false})
  fechaHora!: Date;
  @Property({nullable: false})
  estado!: string;
  @Property({nullable: true})
  calificacion?: number;
  @Property({nullable: true})
  comentario?: string;
  @Property({nullable: true})
  montoFinal?: number;
  @Property({nullable: true})
  fechaPago?: Date;
  @ManyToOne(() => Servicio, { nullable: true })
  servicio?: Rel<Servicio>;

  @ManyToOne(() => Usuario, { cascade: [Cascade.PERSIST], nullable: true })
  usuario?: Rel<Usuario>;
}
