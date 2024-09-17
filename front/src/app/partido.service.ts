import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PartidoService {
  readonly baseUrl = 'http://localhost:3000/api/'

  constructor(private http: HttpClient) { }

  getPartidos() {
    const url = this.baseUrl + 'partidos';
    return this.http.get<any>(url);
  }

  getOnePartido(id:string){
    const url = this.baseUrl + 'partidos/' + id;
    return this.http.get<any>(url);
  }

  remove(id:string){
    const url = this.baseUrl + 'partidos/' + id;
    return this.http.delete<any>(url);
  }

  add(fecha: string, torneo: string, equipo1: string, equipo2: string, id: number) {
    const url = this.baseUrl + 'partidos';
    const data = { fecha, torneo, equipo1, equipo2, id };
    return this.http.post<any>(url, data);
  }

  modPartido(fecha: string, torneo: string, equipo1: string, equipo2: string, id: number){
    const url = this.baseUrl + 'partidos/' + id;
    const data = { fecha, torneo, equipo1, equipo2, id };
    return this.http.put<any>(url, data);
  }
}
