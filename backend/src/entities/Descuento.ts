import { Entity, PrimaryKey, Property, ManyToMany, Collection, Enum } from '@mikro-orm/core';
import { Camiseta } from './Camiseta';

export enum TipoAplicacionDescuento {
  TODAS = 'TODAS',
  CATEGORIA = 'CATEGORIA',
  ESPECIFICAS = 'ESPECIFICAS'
}

@Entity()
export class Descuento {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  codigo!: string;

  @Property()
  descripcion!: string;

  @Property({ type: 'decimal', precision: 5, scale: 2 })
  porcentaje!: number;

  @Property()
  fechaInicio!: Date;

  @Property()
  fechaFin!: Date;

  @Property({ default: true })
  activo: boolean = true;

  @Property()
  fechaCreacion: Date = new Date();

  // ✅ NUEVOS CAMPOS
  @Enum(() => TipoAplicacionDescuento)
  tipoAplicacion: TipoAplicacionDescuento = TipoAplicacionDescuento.TODAS;

  @Property({ nullable: true })
  categoriaId?: number; // ID de la categoría (si tipoAplicacion = CATEGORIA)

  @ManyToMany(() => Camiseta, undefined, { nullable: true })
  camisetasEspecificas = new Collection<Camiseta>(this);

  constructor(
    codigo: string,
    descripcion: string,
    porcentaje: number,
    fechaInicio: Date,
    fechaFin: Date,
    activo: boolean = true,
    tipoAplicacion: TipoAplicacionDescuento = TipoAplicacionDescuento.TODAS,
    categoriaId?: number
  ) {
    this.codigo = codigo;
    this.descripcion = descripcion;
    this.porcentaje = porcentaje;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.activo = activo;
    this.tipoAplicacion = tipoAplicacion;
    this.categoriaId = categoriaId;
  }
}
