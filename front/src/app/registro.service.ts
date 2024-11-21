import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  readonly baseUrl = 'http://localhost:3000/api/'

  constructor(private http: HttpClient) { }

  registro(nombre: string, contraseña: string, apellido: string, fecha: Date, mail: string, tipos_par: number){
    const url = this.baseUrl + 'participantes/registro';
    const fecha_nacimiento = fecha.toISOString().split('T')[0]
    const data = {nombre, contraseña, apellido, fecha_nacimiento, mail, tipos_par}
    return this.http.post<any>(url, data)
  }
}
