import { TipoVolquete, TipoVolqueteModel } from './tipo_volquete.interface.js';


export interface Volquete {
  nro_volquete: number;
  id_tipo_volquete: number;
  fecha_compra: Date;
  fecha_fabricacion: Date;
  marca: string;
  tipo_volquete: TipoVolquete;
}

export class VolqueteModel implements Volquete {
  nro_volquete: number;
  id_tipo_volquete: number;
  fecha_compra: Date;
  fecha_fabricacion: Date;
  marca: string;
  tipo_volquete: TipoVolquete;

  constructor(
    nro_volquete: number = 0,
    id_tipo_volquete: 0,
    fecha_compra: Date = new Date(),
    fecha_fabricacion: Date = new Date(),
    marca: string = '',
    tipo_volquete: TipoVolquete = { id_tipo_volquete: 0, descripcion_tipo_volquete: '' }
  ) {
    this.nro_volquete = nro_volquete;
    this.id_tipo_volquete = id_tipo_volquete;
    this.fecha_compra = fecha_compra;
    this.fecha_fabricacion = fecha_fabricacion;
    this.marca = marca;
    this.tipo_volquete=tipo_volquete;
  }
}
