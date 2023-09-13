import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {API_URL} from './api-url';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {
  readonly URL = API_URL+'permisos/';

  constructor(private clienteHTTP: HttpClient) { }

  getAll(){
    return this.clienteHTTP.get(this.URL);
  }

}

export interface Permiso{
  ID: number;
  descripcion: string;
  predeterminado:boolean;
}