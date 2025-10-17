import { Cascade, Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Wallet } from "../wallet/wallet.entity.js";
import { Notificacion } from "../notificacion/notificacion.entity.js";
import { Localidad } from "../localidad/localidad.entity.js";
@Entity()
export class persona extends BaseEntity {
  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  apellido!: string;

  @Property({ nullable: false }) // Removido hidden: true para poder acceder al password en login
  password!: string;

  @Property({ nullable: false })
  email!: string;

  @Property({ nullable: false })
  tel!: number;


  @Property({ nullable: true })
  direccion?: string;

  @ManyToMany(() => Wallet, (wallet) => wallet.personas, {
    cascade: [Cascade.PERSIST], // Solo persiste, NO elimina las wallets al borrar persona
    owner: true,
  })
  wallets = new Collection<Wallet>(this);

  // relacion muchas personas pertenecen a una localidad
  @ManyToOne(() => Localidad, { nullable: true })
  localidad?: Rel<Localidad>;
  
  // relacion una persona puede tener muchas notificaciones
  @OneToMany(() => Notificacion, (notificacion) => notificacion.persona, {
    cascade: [Cascade.ALL],
  })
  notificaciones = new Collection<Notificacion>(this);

}


// --- relaciones viejas del video de meca ---
/*  @ManyToMany(() => Item, (item) => item.personas, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  items = new Collection<Item>(this);
*/ 
/* @ManyToOne(() => personaClass, { nullable: false })
  personaClass!: Rel<personaClass>; */