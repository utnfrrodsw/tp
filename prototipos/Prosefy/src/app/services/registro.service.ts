import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface Usuario {
  username: string;
  nombre: string;
  apellido: string;
  email: string;
  contraseña: string;
}

export interface RegistroResponse {
  mensaje: string;
  usuario: {
    username: string;
    nombre: string;
    apellido: string;
    email: string;
    id: string;
  };
}

// Interfaz para la estructura de error del inicio de sesión
export interface ErrorRegistroResponse {
  mensaje: string; // Un mensaje de error descriptivo
  codigo?: number; // Un código de error opcional
}

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private apiUrl = 'http://localhost:3000/api/usuarios/';

  constructor(private http: HttpClient) { }

  registrarUsuario(usuario: Usuario): Observable<RegistroResponse> {
    return this.http.post<RegistroResponse>(this.apiUrl, usuario)
      .pipe(
        tap(response => {
          console.log('Registro exitoso', response);
          // Lógica para manejar la respuesta exitosa del registro
        }),
        catchError(this.handleServerError)
      );
  }

  validarUsuarioExistente(username: string): Observable<boolean> {
    const url = `${this.apiUrl}${username}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          console.log('Validación de usuario existente', response);
          return response.exists === true;
        }),
        catchError(this.handleServerError)
      );
  }


  private handleServerError(error: any): Observable<never> {
    console.error('Error en el registro', error);

    const errorMessage: ErrorRegistroResponse = {
      mensaje: 'Error desconocido en el registro'
    };

    // Manejar otros errores

    return throwError(errorMessage);
  }
}