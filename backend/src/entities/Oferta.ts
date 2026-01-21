import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Subasta } from './Subasta';  
import { Usuario } from './Usuario';  

@Entity()
export class Oferta {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  monto!: number;

  @Property()
  fechaOferta: Date = new Date();

  @Property()
  activa: boolean = true;

  // Relaciones
  @ManyToOne(() => Subasta)
  subasta!: Subasta;

  @ManyToOne(() => Usuario)
  usuario!: Usuario;

  constructor(subasta: Subasta, usuario: Usuario, monto: number) {
    this.subasta = subasta;
    this.usuario = usuario;
    this.monto = monto;
  }

  // Método para validar si la oferta es válida
  esValida(): boolean {
    return this.monto > this.subasta.precioActual && this.subasta.estaActiva();
  }
}
