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
    return this.clienteHTTP.get(this.URL+'?incluirHabilitado=true');
  }
  
  cambiarHabilitado(id:number,valor:boolean){
    return this.clienteHTTP.post(this.URL+`${id}/habilitado`,{
      valor
    });
  }

  ingresar(usuario:string, contrasenia:string){
    return this.clienteHTTP.post(this.URL+`ingresar`,{
      usuario
      ,contrasenia
    },{withCredentials: true});
  }

  buscarDifusamentePorNombre(nombre:string) {
    return this.clienteHTTP.get(this.URL+`buscar/${nombre}`);
  }

  invitar(ID:number) {
    return this.clienteHTTP.post(this.URL+`invitar/${ID}`,null,{withCredentials: true});
  }

}

enum EstadosAmistades {
  Esperando = 'esperando',
  Amigos='amigos'
}

interface Amistad{
  estado:EstadosAmistades
  ,amigo:Usuario
  ,iniciador:Usuario
}

export interface Usuario{
  ID: number;
  correo: string;
  nombreUsuario: string;
  nombreCompleto: string;
  contrasenia?: string;
  DNI: string;
  tokens: number;
  permisos?:Permiso[];
  amigos?:Usuario[];
  habilitado:boolean;
}