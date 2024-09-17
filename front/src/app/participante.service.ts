import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParticipanteService {
  readonly baseUrl = 'http://localhost:3000/api/'

  constructor(private http: HttpClient) { }

  getParticipantes() {
    const url = this.baseUrl + 'participantes';
    return this.http.get<any>(url);
  }

  getOneParticipante(id:string){
    const url = this.baseUrl + 'participantes/' + id;
    return this.http.get<any>(url);
  }

  remove(id:string){
    const url = this.baseUrl + 'participantes/' + id;
    return this.http.delete<any>(url);
  }

  add(nombre:string, contraseña:string, apellido:string, mail:string, fecha_nacimiento:string, tipo_par: string, id: number) {
    const url = this.baseUrl + 'participantes';
    const data = { nombre, contraseña, apellido, mail, fecha_nacimiento, tipo_par, id };
    return this.http.post<any>(url, data);
  }

  modParticipante(nombre:string, contraseña:string, apellido:string, mail:string, fecha_nacimiento:string, tipo_par: string, id: number){
    const url = this.baseUrl + 'participantes/' + id;
    const data = { nombre, contraseña, apellido, mail, fecha_nacimiento, tipo_par, id };
    return this.http.put<any>(url, data);
  }
}
