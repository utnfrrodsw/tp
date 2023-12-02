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
  tipo: string;
  contraseña: string;
  _id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient, private iniciarSesionService: IniciarSesionService) { }

  eliminarCuenta(): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      // Manejar el caso en el que no haya un token en el almacenamiento local
      return throwError(()=>'No se encontró un token en el almacenamiento local.');
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

  // GETTERS

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

  getTipo(): Observable<{ data: { tipo: string } }> {
    const endpoint = "get-tipo";
    return this.getData(endpoint);
  }

  private getData(endpoint: string): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError('No se encontró un token en el almacenamiento local.');
    }

    const apiUrl = 'http://localhost:3000/api/usuarios'

    const url = `${apiUrl}/${endpoint}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(url, { headers }).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error obteniendo datos:', error);
        return throwError(()=>'Error en la solicitud al servidor.');
      })
    );
  }

  // SETTERS

  private setData<T>(setter: string, value: string): Observable<T> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró un token en el almacenamiento local.');
    }

    const apiUrl = 'http://localhost:3000/api/usuarios'
    const url = `${apiUrl}/${setter}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const body = {
      sanitizedInput: {
        [setter]: value,
      },
    };

    return this.http.put<T>(url, body, { headers });
  }

  // Función para actualizar el nombre
  setNombre(nombre: string): Observable<any> {
    return this.setData('set-nombre', nombre);
  }

  // Función para actualizar el apellido
  setApellido(apellido: string): Observable<any> {
    return this.setData('set-apellido', apellido);
  }

  // Función para actualizar el correo electrónico
  setEmail(email: string): Observable<any> {
    return this.setData('set-email', email);
  }

  // Función para actualizar el nombre de usuario
  setUsername(username: string): Observable<any> {
    return this.setData('set-username', username);
  }

  // Función para actualizar el tipo
  setTipo(tipo: string): Observable<any> {
    return this.setData('set-tipo', tipo);
  }

  actualizarUsuario(usuarioId: string, datosActualizados: any): Observable<any> {
    const url = `http://localhost:3000/api/usuarios/${usuarioId}`;

    // Puedes ajustar el tipo de solicitud (POST, PUT, PATCH) según la implementación de tu servidor
    return this.http.put(url, { sanitizedInput: datosActualizados });
  }

}