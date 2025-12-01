import { Entity, ManyToOne, Property, Rel, Enum } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Turno } from '../turno/turno.entity.js';

@Entity()
export class Pago extends BaseEntity {
  @Property({ unique: true })
  paymentIntentId!: string; // ID del PaymentIntent en Stripe

  @Property()
  amount!: number; // Monto total en centavos

  @Property({ length: 3 })
  currency!: string; // Moneda ISO (ej: 'usd', 'ars')

  @Property()
  estado!:
    | 'requires_payment_method'
    | 'requires_confirmation'
    | 'requires_action'
    | 'processing'
    | 'succeeded'
    | 'requires_capture'
    | 'canceled';

  @Property()
  sellerStripeId!: string; // ID de la cuenta conectada del vendedor

  @Property()
  amountReceived!: number; // Lo que recibe el vendedor después de el cobro

  @Property({ nullable: true })
  applicationFeeAmount?: number; // Lo que cobra la plataforma

  @Property({ nullable: true })
  transferId?: string; // ID de la transferencia a la cuenta del vendedor

  @Property({ nullable: true })
  buyerEmail?: string; // Email del comprador

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, any>; // Datos extra como productId, orderId

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne(() => Turno, { nullable: false })
  turno!: Rel<Turno>;
}
