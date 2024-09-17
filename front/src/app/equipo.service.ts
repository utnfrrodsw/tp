import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

  modEquipo(jugador1: string, jugador2: string, jugador3: string, jugador4: string, jugador5: string, torneo: string, id: number){
    const url = this.baseUrl + 'equipos/' + id;
    const data = { jugador1, jugador2, jugador3, jugador4, jugador5, torneo, id };
    return this.http.put<any>(url, data);
  }
}
