import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { json } from 'stream/consumers';


@Injectable({
  providedIn: 'root'
})
export class EstadoTorneoService {
  
  readonly baseUrl = 'http://localhost:3000/api/'

  constructor(private http: HttpClient) { }

  getEstados() {
    const url = this.baseUrl + 'estado_torneo';
    return this.http.get<any>(url);
  }
  
  getOneEstados(id:string){
    const url = this.baseUrl + 'estado_torneo/' + id;
    return this.http.get<any>(url);
  }

  remove(id:string){
    const url = this.baseUrl + 'estado_torneo/' + id;
    return this.http.delete<any>(url);
  }
}
