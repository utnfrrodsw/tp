import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, Enum } from '@mikro-orm/core';
import { Usuario } from './Usuario';      
import { MetodoPago } from './MetodoPago'; 
import { Pago } from './Pago';    
import { CompraItem } from './CompraItem';

export enum EstadoCompra {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  PAGADA = 'pagada',
  ENVIADA = 'enviada',
  ENTREGADA = 'entregada',
  CANCELADA = 'cancelada'
}

@Entity()
export class Compra {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  total!: number;

  @Enum(() => EstadoCompra)
  estado: EstadoCompra = EstadoCompra.PENDIENTE;

  @Property()
  fechaCompra: Date = new Date();

  @Property({ nullable: true })
  direccionEnvio?: string;

  @Property({ type: 'text', nullable: true })
  notas?: string;

  @ManyToOne('Usuario')
  comprador!: Usuario;

  // ✅ ITEMS: La forma correcta de manejar múltiples productos
  @OneToMany(() => CompraItem, item => item.compra, { eager: true })
  items = new Collection<CompraItem>(this);

  @ManyToOne('MetodoPago')
  metodoPago!: MetodoPago;

  @OneToMany(() => Pago, pago => pago.compra)
  pagos = new Collection<Pago>(this);

  constructor(
    total: number,
    comprador: Usuario,
    metodoPago: MetodoPago,
    direccionEnvio?: string
  ) {
    this.total = total;
    this.comprador = comprador;
    this.metodoPago = metodoPago;
    this.direccionEnvio = direccionEnvio;
  }
}
