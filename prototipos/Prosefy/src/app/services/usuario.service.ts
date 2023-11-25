import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, catchError, map, throwError } from "rxjs";
import { IniciarSesionService } from './iniciar-sesion.service';

export interface Usuario {
  username: string;
  nombre: string;
  apellido: string;
  email: string;
  direccion?: string;
  localidad?: string;
  avatar?: string;
  tipo?: string;
  contraseña: string;
  _id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl: string = "http://localhost:3000/api/usuarios";

  constructor(private http: HttpClient, private iniciarSesionService: IniciarSesionService) { }

  eliminarCuenta(): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      // Manejar el caso en el que no haya un token en el almacenamiento local
      return throwError('No se encontró un token en el almacenamiento local.');
    }

    const url = "http://localhost:3000/api/usuarios";
    const options = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    localStorage.removeItem('token');
    this.iniciarSesionService.checkToken();
    return this.http.delete(url, options);
  }

  getNombre(): Observable<{ data: { nombre: string } }> {
    const endpoint = "get-nombre";
    return this.getData(endpoint);
  }

  getApellido(): Observable<{ data: { apellido: string } }> {
    const endpoint = "get-apellido";
    return this.getData(endpoint);
  }

  getEmail(): Observable<{ data: { email: string } }> {
    const endpoint = "get-email";
    return this.getData(endpoint);
  }

  getUsername(): Observable<{ data: { username: string } }> {
    const endpoint = "get-username";
    return this.getData(endpoint);
  }

  private getData(endpoint: string): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError('No se encontró un token en el almacenamiento local.');
    }

    const url = `${this.apiUrl}/${endpoint}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(url, { headers }).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error obteniendo datos:', error);
        return throwError('Error en la solicitud al servidor.');
      })
    );
  }
}