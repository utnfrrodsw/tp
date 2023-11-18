import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Usuario } from './usuario.service';

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
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<RegistroResponse>(this.apiUrl, usuario, httpOptions)
      .pipe(
        tap(response => {
          console.log('Registro exitoso', response);
          // Lógica para manejar la respuesta exitosa del registro
        }),
        catchError((error: HttpErrorResponse) => {
          return this.handleServerError(error);
        })
      );
  }

  validarUsuarioExistente(username: string): Observable<Usuario | null> {
    const url = `${this.apiUrl}${username}`;
    return this.http.get<Usuario>(url)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return of(null);
          } else {
            return throwError(error);
          }
        })
      );
  }

  validarEmailExistente(email: string): Observable<Usuario | null> {
    const url = `${this.apiUrl}email/${email}`;
    return this.http.get<Usuario>(url)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return of(null);
          } else {
            return throwError(error);
          }
        })
      );
  }

  private handleServerError(error: any): Observable<never> {
    console.error('Error en el registro', error);

    const errorMessage: ErrorRegistroResponse = {
      mensaje: 'Error desconocido en el registro'
    };

    if (error instanceof HttpErrorResponse) {
      errorMessage.mensaje = error.error?.mensaje || 'Error desconocido en el registro';
      console.error('Detalles del error:', error.error);
    }

    return throwError(errorMessage);
  }
}
