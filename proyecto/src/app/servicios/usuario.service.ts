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

  create(usuario: Usuario) {
    return this.clienteHTTP.post(this.URL,usuario);
  }
  
  getAll(){
    return this.clienteHTTP.get(this.URL);
  }

  getByID(id:number){
    return this.clienteHTTP.get(this.URL+`${id}`);
  }

  delete(id:number){
    return this.clienteHTTP.delete(this.URL+`${id}`);
  }

  edit(usuario: Usuario){
    return this.clienteHTTP.put(this.URL+`${usuario.ID}`,usuario);
  }
  enviarTokens(IDEmisor:number,IDReceptor:number,tokens:number){
    return this.clienteHTTP.put(this.URL+`${IDEmisor}/tokens`,{
      receptorID:IDReceptor
      ,tokens
    });
  }
  getFuzzilyByName(nombre:string) {
    return this.clienteHTTP.get(this.URL+`buscar/${nombre}`);
  }

}

export interface Usuario{
  ID?: number;
  correo: string;
  contrasenia?: string;
  nombreUsuario: string;
  nombreCompleto: string;
  DNI?: string;
  tokens: number;
  tokensAsociadas?: any[];
  permisos?:Permiso[]
}