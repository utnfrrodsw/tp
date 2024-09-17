import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  readonly baseUrl = 'http://localhost:3000/api/'

  constructor(private http: HttpClient) { }

  getAdmins() {
    const url = this.baseUrl + 'admins';
    return this.http.get<any>(url);
  }

  getOneAdmin(id:string){
    const url = this.baseUrl + 'admins/' + id;
    return this.http.get<any>(url);
  }

  remove(id:string){
    const url = this.baseUrl + 'admins/' + id;
    return this.http.delete<any>(url);
  }

  add(nombre:string, contraseña:string, apellido:string, mail:string, fecha_nacimiento:string, id: number) {
    const url = this.baseUrl + 'admins';
    const data = { nombre, contraseña, apellido, mail, fecha_nacimiento, id };
    return this.http.post<any>(url, data);
  }

  modAdmin(nombre:string, contraseña:string, apellido:string, mail:string, fecha_nacimiento:string, id: number){
    const url = this.baseUrl + 'admins/' + id;
    const data = { nombre, contraseña, apellido, mail, fecha_nacimiento, id };
    return this.http.put<any>(url, data);
  }
}
