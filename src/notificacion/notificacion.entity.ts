import { Cascade, Collection, Entity, ManyToMany, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { persona } from "../personas/personas.entity.js";
import { Wallet } from "../wallet/wallet.entity.js";

@Entity()
export class Notificacion extends BaseEntity {
  // Descuento mínimo para activar la notificación
  @Property({ nullable: false })
  min_descuento!: number;

  // Tipos de beneficio de interés (array de strings)
  @Property({ type: 'json', nullable: false })
  tipos_beneficio!: string[];

  // Medio de envío de la notificación
  @Property({ nullable: false, default: 'email' })
  medio_envio: string = 'email';

  // Estado activo/inactivo de la notificación
  @Property({ nullable: false, default: true })
  activo: boolean = true;

  // Fecha de creación de la notificación
  @Property({ nullable: false })
  fecha_creacion: Date = new Date();

  // Fecha de la última notificación enviada
  @Property({ nullable: true })
  fecha_ultima_notificacion?: Date;

  // Relación ManyToOne con Persona - una persona puede tener muchas notificaciones
  @ManyToOne(() => persona, { nullable: false })
  persona!: Rel<persona>;

  // Relación ManyToMany con Wallet - una notificación puede estar asociada a varias billeteras
  @ManyToMany(() => Wallet, (wallet) => wallet.notificaciones, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  wallets = new Collection<Wallet>(this);
}
