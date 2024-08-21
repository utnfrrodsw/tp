export interface TipoVolquete {
  id_tipo_volquete: number;
  descripcion_tipo_volquete: string;
}
export class TipoVolqueteModel implements TipoVolquete {
  id_tipo_volquete: number = 0;
  descripcion_tipo_volquete: string = '';
}
