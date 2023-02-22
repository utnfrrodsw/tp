import { Injectable } from '@angular/core';
import { Usuario } from './usuario.service';
import { HttpClient} from '@angular/common/http';
import { API_URL } from './api-url';

@Injectable({
  providedIn: 'root'
})
export class UsuarioActualService {

  constructor(private clienteHTTP: HttpClient){}

  getUsuarioActual(){
    return this.clienteHTTP.get(API_URL+'usuarios/actual',{withCredentials: true});
  }
}
