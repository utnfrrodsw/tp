import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  readonly baseUrl = 'http://localhost:3000/api/'

  constructor(private http: HttpClient) { }

  getSucursales() {
    const url = this.baseUrl + 'sucursales';
    return this.http.get<any>(url);
  }

  getOneSucursal(id:string){
    const url = this.baseUrl + 'sucursales/' + id;
    return this.http.get<any>(url);
  }

  remove(id:string){
    const url = this.baseUrl + 'sucursales/' + id;
    return this.http.delete<any>(url);
  }

  add(nombre_sucursal: string, localidad: string, id: number) {
    const url = this.baseUrl + 'sucursales';
    const data = { nombre_sucursal, localidad, id };
    return this.http.post<any>(url, data);
  }

  modSucursal(nombre_sucursal: string, localidad: string, id: number){
    const url = this.baseUrl + 'sucursales/' + id;
    const data = { nombre_sucursal, localidad, id };
    return this.http.put<any>(url, data);
  }
}
