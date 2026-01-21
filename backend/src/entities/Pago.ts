import { Entity, PrimaryKey, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { Compra } from './Compra';      
import { MetodoPago } from './MetodoPago'; 

export enum EstadoPago {
  PENDIENTE = 'pendiente',
  PROCESANDO = 'procesando',
  COMPLETADO = 'completado',
  FALLIDO = 'fallido',
  CANCELADO = 'cancelado'
}

@Entity()
export class Pago {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  monto!: number;

  @Enum(() => EstadoPago)
  estado: EstadoPago = EstadoPago.PENDIENTE;

  @Property()
  fechaPago: Date = new Date();

  @Property({ nullable: true })
  numeroTransaccion?: string;

  @Property({ type: 'text', nullable: true })
  notas?: string;

  @ManyToOne('Compra')
  compra!: Compra;

  @ManyToOne('MetodoPago')
  metodoPago!: MetodoPago;

  constructor(
    monto: number,
    compraId: number,
    metodoPagoId: number,
    numeroTransaccion?: string
  ) {
    this.monto = monto;
    this.compra = compraId as any;
    this.metodoPago = metodoPagoId as any;
    this.numeroTransaccion = numeroTransaccion;
  }
}
