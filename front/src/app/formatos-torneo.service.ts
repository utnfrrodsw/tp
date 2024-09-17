import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatosTorneoService {
  readonly baseUrl = 'http://localhost:3000/api/'

  constructor(private http: HttpClient) { }

  getFormatos() {
    const url = this.baseUrl + 'formatos_torneo';
    return this.http.get<any>(url);
  }

  getOneFormato(id:string){
    const url = this.baseUrl + 'formatos_torneo/' + id;
    return this.http.get<any>(url);
  }

  remove(id:string){
    const url = this.baseUrl + 'formatos_torneo/' + id;
    return this.http.delete<any>(url);
  }

  add(cant_grupos:number, cant_equipos_x_grupo:number, cant_clasificados_x_grupo:number, id:number) {
    const url = this.baseUrl + 'formatos_torneo';
    const data = { cant_grupos, cant_equipos_x_grupo, cant_clasificados_x_grupo, id };
    return this.http.post<any>(url, data);
  }

  modFormato(cant_grupos:number, cant_equipos_x_grupo:number, cant_clasificados_x_grupo:number, id:number){
    const url = this.baseUrl + 'formatos_torneo/' + id;
    const data = { cant_grupos, cant_equipos_x_grupo, cant_clasificados_x_grupo, id };
    return this.http.put<any>(url, data);
  }
}
