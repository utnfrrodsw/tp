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

}