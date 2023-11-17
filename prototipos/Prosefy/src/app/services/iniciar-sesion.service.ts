// iniciar-sesion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface IniciarSesionResponse {
  token: string;
  usuario: {
    id: string;
    nombre: string;
    email: string;
  };
}

// Iinterfaz para la estructura de error del inicio de sesión
export interface ErrorIniciarSesionResponse {
  mensaje: string; // Un mensaje de error descriptivo
  codigo?: number; // Un código de error opcional
}

@Injectable({
  providedIn: 'root'
})
export class IniciarSesionService {

  private apiUrl = 'http://localhost:3000/api/usuarios/iniciar-sesion';

  constructor(private http: HttpClient) { }

  iniciarSesion(email: string, contraseña: string): Observable<IniciarSesionResponse> {
    const body = { email, contraseña };
    return this.http.post<IniciarSesionResponse>(this.apiUrl, body)
      .pipe(
        tap(response => {
          // Lógica para manejar la respuesta exitosa
          console.log('Inicio de sesión exitoso', response);

          // TODO: Almacena el token en el almacenamiento local
        }),
        catchError(this.handleServerError)
      );
  }

  private handleServerError(error: any): Observable<never> {
    // Lógica para manejar errores del servidor
    console.error('Error en el inicio de sesión', error);

    const errorMessage: ErrorIniciarSesionResponse = {
      mensaje: 'Error desconocido en el inicio de sesión'
    };

    if (error.status === 401) {
      // Lógica para manejar errores de autenticación (por ejemplo, credenciales incorrectas)
      errorMessage.mensaje = 'Credenciales inválidas';
    }

    return throwError(errorMessage);
  }
}