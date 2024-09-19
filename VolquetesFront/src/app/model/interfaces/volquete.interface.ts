import { TipoVolquete, TipoVolqueteModel } from './tipo_volquete.interface.js';


export interface Volquete {
  nro: number;
  tipo_volquete: number;
  fecha_compra: Date;
  fecha_fabricacion: Date;
  marca: string;
}

export class VolqueteModel implements Volquete {
  nro: number;
  tipo_volquete: number;
  fecha_compra: Date;
  fecha_fabricacion: Date;
  marca: string;

  constructor(
    nro: number = 0,
    tipo_volquete: 0,
    fecha_compra: Date = new Date(),
    fecha_fabricacion: Date = new Date(),
    marca: string = ''
  ) {
    this.nro = nro;
    this.tipo_volquete = tipo_volquete;
    this.fecha_compra = fecha_compra;
    this.fecha_fabricacion = fecha_fabricacion;
    this.marca = marca;
  }
}
