import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TipoParticipanteService {

  readonly baseUrl = 'http://localhost:3000/api/'

  constructor(private http: HttpClient) { }

  getTipo_Participante() {
    const url = this.baseUrl + 'tipo_participantes';
    return this.http.get<any>(url);
  }

  getOneTipo(id:string){
    const url = this.baseUrl + 'tipo_participantes/' + id;
    return this.http.get<any>(url);
  }

  remove(id:string){
    const url = this.baseUrl + 'tipo_participantes/' + id;
    return this.http.delete<any>(url);
  }

  add(posicion: string, id: number) {
    const url = this.baseUrl + 'tipo_participantes';
    const data = { posicion, id };
    return this.http.post<any>(url, data);
  }

  modTipo(posicion: string, id: number){
    const url = this.baseUrl + 'tipo_participantes/' + id;
    const data = { posicion, id };
    return this.http.put<any>(url, data);
  }
}
