import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';


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

  getOne(id:string){
    const url = this.baseUrl + 'formatos_torneo/' + id;
    return this.http.get<any>(url);
  }

  remove(id:string){
    const url = this.baseUrl + 'admins/' + id;
    return this.http.delete<any>(url);
  }

  addTorneo(nombre_torneo:string, fecha_inicio_torneo:string, fecha_fin_torneo:string, admin:number, sucursal:number, estado_torneo: number, formato_torneo: number, id: number) {
    const url = this.baseUrl + 'torneos';
    const data = { nombre_torneo, fecha_inicio_torneo, fecha_fin_torneo, admin, sucursal, estado_torneo, formato_torneo, id };
    return this.http.post<any>(url, data);
  }

  addEquipos(id_torneo: number, E_formato_torneo: any){
    const cant_equipos = E_formato_torneo.data.cant_equipos;
    const requests = [];
    for (let i=0; i < cant_equipos; i++){
      const url = this.baseUrl + 'equipos';
      const data = { torneo: id_torneo };
      requests.push(this.http.post<any>(url, data));
    }
    return forkJoin (requests)
  }

  addPartidos(id_torneo: number, E_formato_torneo: any){
    const cant_partidos = E_formato_torneo.data.cant_partidos;
    const requests = [];
    for (let i=0; i < cant_partidos; i++){
      const url = this.baseUrl + 'partidos';
      const data = { torneo: id_torneo };
      requests.push(this.http.post<any>(url, data));
    }
    return forkJoin (requests)
  }
 
  
  modAdmin(nombre:string, contraseña:string, apellido:string, mail:string, fecha_nacimiento:string, id: number){
    const url = this.baseUrl + 'admins/' + id;
    const data = { nombre, contraseña, apellido, mail, fecha_nacimiento, id };
    return this.http.put<any>(url, data);
  }
}
