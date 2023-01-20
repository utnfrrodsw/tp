import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Permiso } from './permiso.service';
import { API_URL } from './api-url';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  readonly URL = API_URL+'usuarios/';

  constructor(private clienteHTTP: HttpClient) { }

  getAll(){
    return this.clienteHTTP.get(this.URL+'?incluirHabilitado=true');
  }
  
  cambiarHabilitado(id:number,valor:boolean){
    return this.clienteHTTP.post(this.URL+`${id}/habilitado`,{
      valor
    });
  }

}

export interface Usuario{
  ID: number;
  correo: string;
  nombreUsuario: string;
  nombreCompleto: string;
  DNI: string;
  tokens: number;
  permisos?:Permiso[];
  habilitado:boolean;
}