import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalidadesService {
  
  readonly baseUrl = 'http://localhost:3000/api/'

  constructor(private http: HttpClient) { }

  getLocalidades() {
    const url = this.baseUrl + 'localidades';
    return this.http.get<any>(url);
  }

  getOneLocalidad(id:string){
    const url = this.baseUrl + 'localidades/' + id;
    return this.http.get<any>(url);
  }

  remove(id:string){
    const url = this.baseUrl + 'localidades/' + id;
    return this.http.delete<any>(url);
  }

  add(nombre_localidad: string, id: number) {
    const url = this.baseUrl + 'localidades';
    const data = { nombre_localidad, id };
    return this.http.post<any>(url, data);
  }

  modLocalidad(nombre_localidad: string, id: number){
    const url = this.baseUrl + 'localidades/' + id;
    const data = { nombre_localidad, id };
    return this.http.put<any>(url, data);
  }
}