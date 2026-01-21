import { Entity, PrimaryKey, ManyToOne, Property } from '@mikro-orm/core';
import { Compra } from './Compra';
import { Camiseta } from './Camiseta';

@Entity()
export class CompraItem {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Compra)
  compra!: Compra;

  @ManyToOne(() => Camiseta)
  camiseta!: Camiseta;

  @Property()
  cantidad: number = 1;

  // ✅ AGREGAR: Precio unitario al momento de la compra
  @Property({ type: 'decimal', precision: 10, scale: 2 })
  precioUnitario!: number;

  // ✅ AGREGAR: Subtotal calculado
  @Property({ type: 'decimal', precision: 10, scale: 2 })
  subtotal!: number;
}