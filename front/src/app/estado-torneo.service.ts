import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

  add(nombre_estado: string, id: number) {
    const url = this.baseUrl + 'estado_torneo';
    const data = { nombre_estado, id };
    return this.http.post<any>(url, data);
  }

  modEstado(nombre_estado: string, id: number){
    const url = this.baseUrl + 'estado_torneo/' + id;
    const data = { nombre_estado, id};
    return this.http.put<any>(url, data);
  }
}
