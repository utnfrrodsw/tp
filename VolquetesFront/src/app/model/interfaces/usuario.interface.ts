export interface Usuario {
  id_usuario: number;
  nombre_usuario: string;
  hash: string;
  rol: string;
}
export class UsuarioModel implements Usuario {
  id_usuario: number = 0;
  nombre_usuario: string = '';
  hash: string ='';
  rol: string='';
}
