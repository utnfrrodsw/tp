export interface TipoVolquete {
  id: number;
  descripcion: string;
}
export class TipoVolqueteModel implements TipoVolquete {
  id: number = 0;
  descripcion: string = '';
}
