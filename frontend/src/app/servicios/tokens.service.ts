import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {API_URL} from './api-url';

@Injectable({
  providedIn: 'root'
})
export class TokensService {
  readonly URL = API_URL+'tokens/';

  constructor(private clienteHTTP: HttpClient) { }
  
  obtenerCantidadCirculando(){
    return this.clienteHTTP.get(this.URL,{withCredentials: true});
  }

  generar(cantidad:number){
    return this.clienteHTTP.post(this.URL,{cantidad},{withCredentials: true});
  }

  enviar(cantidad:number,amigoID:number){
    return this.clienteHTTP.patch(this.URL,{cantidad,amigoID},{withCredentials: true});
  }

}