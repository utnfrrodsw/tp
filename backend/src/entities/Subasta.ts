import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Camiseta } from './Camiseta';  
import { Usuario } from './Usuario';    

@Entity()
export class Subasta {
  @PrimaryKey()
  id!: number;

  @Property({ fieldName: 'fecha_inicio' })
  fechaInicio!: Date;

  @Property({ fieldName: 'fecha_fin' })
  fechaFin!: Date;

  @Property({ type: 'decimal', precision: 8, scale: 2 })
  precioActual!: number;

  @Property()
  activa: boolean = true;

  // Relaciones
  @ManyToOne(() => Camiseta)
  camiseta!: Camiseta;

  @ManyToOne(() => Usuario, { nullable: true })
  ganador?: Usuario;

  // ✅ CORREGIDO: Constructor con parámetros obligatorios
  constructor(fechaInicio: Date, fechaFin: Date, precioActual: number, camiseta: Camiseta) {
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.precioActual = precioActual;
    this.camiseta = camiseta;
  }

  // Método auxiliar
  estaActiva(): boolean {
    const ahora = new Date();
    return this.activa && this.fechaFin > ahora;
  }
}
