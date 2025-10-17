import {  Cascade, Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property, Rel} from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Beneficio } from "../beneficios/beneficios.entity.js";
import { persona } from "../personas/personas.entity.js";
import { Notificacion } from "../notificacion/notificacion.entity.js";

@Entity()
export class Wallet extends BaseEntity {
  @Property({nullable: false})
  name!: string;

  @Property({nullable: false})
  descripcion!: string;
  @Property({ nullable: true })
  interes_anual?: number;

  // relacion con personas de muchos a muchos con wallet
  @ManyToMany(() => persona, (p) => p.wallets)
  personas = new Collection<persona>(this);

  // relacion uno a muchos con beneficios (un wallet tiene muchos beneficios)
@OneToMany(() => Beneficio, (beneficio) => beneficio.wallet, {
    cascade: [Cascade.ALL],
  })
  beneficios = new Collection<Beneficio>(this);

  // relacion muchos a muchos con notificaciones
  @ManyToMany(() => Notificacion, (notificacion) => notificacion.wallets)
  notificaciones = new Collection<Notificacion>(this);
}
