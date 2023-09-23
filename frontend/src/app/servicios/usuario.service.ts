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
  
  cambiarHabilitado(ID:number,valor:boolean){
    return this.clienteHTTP.post(this.URL+`${ID}/habilitado`,{
      valor
    });
  }

  ingresar(usuario:string, contrasenia:string){
    return this.clienteHTTP.post(this.URL+`ingresar`,{
      usuario
      ,contrasenia
    },{withCredentials: true});
  }

  salir(){
    return this.clienteHTTP.post(this.URL+`salir`,{},{withCredentials: true});
  }

  buscarDifusamentePorNombre(nombre:string) {
    return this.clienteHTTP.get(this.URL+`buscar/${nombre}`,{withCredentials: true});
  }

  invitar(ID:number) {
    return this.clienteHTTP.post(this.URL+`invitacion/${ID}`,null,{withCredentials: true});
  }

  eliminarInvitacion(ID:number,soyInvitador:boolean) {
    return this.clienteHTTP.delete(this.URL+`invitacion/${ID}`,{
      withCredentials: true
      ,body:{soyInvitador}
    });
  }

  aceptarInvitacion(ID:number) {
    return this.clienteHTTP.patch(this.URL+`invitacion/${ID}`,{},{
      withCredentials: true
    });
  }

  eliminarAmigo(ID:number) {
    return this.clienteHTTP.delete(this.URL+`amigo/${ID}`,{
      withCredentials: true
    });
  }

  getCantidadDePaginas(filtro:string){
    return this.clienteHTTP.get(this.URL+'cantidad/'+filtro,{withCredentials: true});
  }

  getUsuariosPagina(filtro:string,n:number){
    return this.clienteHTTP.get(this.URL+`buscar/${filtro}`+'?pagina='+n+'&incluirAmigos=1',{withCredentials: true});
  }
}

export enum EstadosAmistades {
  Esperando = 'esperando',
  Amigos='amigos'
}

export interface Amistad{
  // TODO Ver qué onda esto, contrastado con "el modelo" (la base de datos)
  estado:EstadosAmistades
  // ,amigo:Usuario
  ,amigoID:number
  // ,iniciador:Usuario
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
  amistades:Amistad
  habilitado:boolean;
}