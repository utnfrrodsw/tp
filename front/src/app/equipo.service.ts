import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {
  readonly baseUrl = 'http://localhost:3000/api/'

  constructor(private http: HttpClient) { }

  getEquipos() {
    const url = this.baseUrl + 'equipos';
    return this.http.get<any>(url);
  }

  getOneEquipo(id:string){
    const url = this.baseUrl + 'equipos/' + id;
    return this.http.get<any>(url);
  }

  remove(id:string){
    const url = this.baseUrl + 'equipos/' + id;
    return this.http.delete<any>(url);
  }

  add(jugador1: string, jugador2: string, jugador3: string, jugador4: string, jugador5: string, torneo: string, id: number) {
    const url = this.baseUrl + 'equipos';
    const data = { jugador1, jugador2, jugador3, jugador4, jugador5, torneo, id };
    return this.http.post<any>(url, data);
  }

  addEquiposTorneo(id_torneo: number, E_formato_torneo: any){
    const cant_equipos = E_formato_torneo.data.cant_equipos;
    const requests = [];
    for (let i=0; i < cant_equipos; i++){
      const url = this.baseUrl + 'equipos';
      const data = { torneo: id_torneo };
      requests.push(this.http.post<any>(url, data));
    }
    return forkJoin (requests)
  }

  modEquipo(jugador1: string, jugador2: string, jugador3: string, jugador4: string, jugador5: string, torneo: string, id: number){
    const url = this.baseUrl + 'equipos/' + id;
    const data = { jugador1, jugador2, jugador3, jugador4, jugador5, torneo, id };
    return this.http.put<any>(url, data);
  }
}
