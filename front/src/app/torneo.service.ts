import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TorneoService {
  readonly baseUrl = 'http://localhost:3000/api/'

  constructor(private http: HttpClient) { }

  getTorneos() {
    const url = this.baseUrl + 'torneos';
    return this.http.get<any>(url);
  }

  getOneTorneo(id:string){
    const url = this.baseUrl + 'torneos/' + id;
    return this.http.get<any>(url);
  }

  remove(id:string){
    const url = this.baseUrl + 'torneos/' + id;
    return this.http.delete<any>(url);
  }

  add(nombre_torneo: string,
    fecha_inico_insc: string,
    fecha_fin_insc: string,
    fecha_inicio_torneo: string,
    fecha_fin_torneo: string,
    estado_tor: string,
    ganador: string,
    formato: string,
    sucursal: string,
    nro_adm: string,
    id: number) {
    const url = this.baseUrl + 'torneos';
    const data = { 
      nombre_torneo,
      fecha_inico_insc,
      fecha_fin_insc,
      fecha_inicio_torneo,
      fecha_fin_torneo,
      estado_tor,
      ganador,
      formato,
      sucursal,
      nro_adm,
      id};
    return this.http.post<any>(url, data);
  }

  modTorneo(nombre_torneo: string,
    fecha_inico_insc: string,
    fecha_fin_insc: string,
    fecha_inicio_torneo: string,
    fecha_fin_torneo: string,
    estado_tor: string,
    ganador: string,
    formato: string,
    sucursal: string,
    nro_adm: string,
    id: number){
    const url = this.baseUrl + 'torneos/' + id;
    const data = {nombre_torneo,
      fecha_inico_insc,
      fecha_fin_insc,
      fecha_inicio_torneo,
      fecha_fin_torneo,
      estado_tor,
      ganador,
      formato,
      sucursal,
      nro_adm,
      id};
    return this.http.put<any>(url, data);
  }
}
