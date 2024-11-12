import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  readonly baseUrl = 'http://localhost:3000/api/'

  constructor(private http: HttpClient) { }

  getAdmins() {
    const url = this.baseUrl + 'admins';
    return this.http.get<any>(url);
  }

  getOneAdmin(id:string){
    const url = this.baseUrl + 'admins/' + id;
    return this.http.get<any>(url);
  }

  remove(id:string){
    const url = this.baseUrl + 'admins/' + id;
    return this.http.delete<any>(url);
  }

  add(nombre_torneo:string, fecha_inicio_torneo:string, fecha_fin_torneo:string, admin:number, sucursal:number, estado_torneo: number, formato_torneo: number, id: number) {
    const url = this.baseUrl + 'torneos';
    const data = { nombre_torneo, fecha_inicio_torneo, fecha_fin_torneo, admin, sucursal, estado_torneo, formato_torneo, id };
    return this.http.post<any>(url, data);
  }

  addEquipos(torneo: number){
    const url = this.baseUrl + 'equipos';
    const data = { torneo };
    return this.http.post<any>(url, data);
  }

  modAdmin(nombre:string, contraseña:string, apellido:string, mail:string, fecha_nacimiento:string, id: number){
    const url = this.baseUrl + 'admins/' + id;
    const data = { nombre, contraseña, apellido, mail, fecha_nacimiento, id };
    return this.http.put<any>(url, data);
  }
}
