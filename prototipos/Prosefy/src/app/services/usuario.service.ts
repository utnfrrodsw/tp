import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";

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

  constructor(private http: HttpClient) { }

  getUsuarioPorId(usuarioId: string): Observable<Usuario> {
    const url = `${this.apiUrl}/${usuarioId}`;
    return this.http.get<Usuario>(url);
  }

  eliminarCuenta(idUsuario: string): Observable<any> {
    // Verifica si el ID tiene el formato correcto
    const isValidId = /^[0-9a-fA-F]{24}$/.test(idUsuario);

    if (!isValidId) {
      // Maneja el error o lanza una excepción según tu lógica
      console.error('ID de usuario no válido');
      return throwError('ID de usuario no válido');
    }

    const url = `${this.apiUrl}/${idUsuario}`;

    return this.http.delete(url);
  }
}