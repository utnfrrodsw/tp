import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TorneoService {
  readonly baseUrl = 'http://localhost:3000/api/'

  constructor(private http: HttpClient) { }

  getTorneos() {
    const url = this.baseUrl + 'torneos'
    return this.http.get<any>(url)
  }

  getOneTorneo(id:string){
    const url = this.baseUrl + 'torneos/' + id
    return this.http.get<any>(url)
  }

  remove(id:string){
    const url = this.baseUrl + 'torneos/' + id
    return this.http.delete<any>(url)
  }

  addTorneo(nombre_torneo:string, fecha_inicio_torneo:string, fecha_fin_torneo:string, admin:number, sucursal:number, estado_torneo: number, formato_torneo: number, id: number) {
    const url = this.baseUrl + 'torneos'
    const data = { nombre_torneo, fecha_inicio_torneo, fecha_fin_torneo, admin, sucursal, estado_torneo, formato_torneo, id }
    return this.http.post<any>(url, data)
  }

  modTorneo(id_estado: number, id: number){
    const url = this.baseUrl + 'torneos/' + id
    const estado_torneo = id_estado
    const data = {estado_torneo};
    return this.http.patch<any>(url, data)
  }

  modTorneoFechaIni(fecha_inicio:string, torneo_id:number){
    const url = this.baseUrl + 'torneos/' + torneo_id
    const fecha_inicio_torneo = fecha_inicio
    const data = {fecha_inicio_torneo}
    return this.http.patch<any>(url, data)
  }

  modTorneoFechaFin(fecha_fin:string, torneo_id:number){
    const url = this.baseUrl + 'torneos/' + torneo_id
    const fecha_fin_torneo = fecha_fin
    const data = {fecha_fin_torneo}
    return this.http.patch<any>(url, data)
  }
}
