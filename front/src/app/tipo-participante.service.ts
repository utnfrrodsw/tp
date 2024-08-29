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
}
