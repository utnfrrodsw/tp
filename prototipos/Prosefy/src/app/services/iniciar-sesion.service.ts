// iniciar-sesion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface IniciarSesionResponse {
  token: string;
  usuario: {
    id: string;
    nombre: string;
    email: string;
  };
}

// Interfaz para la estructura de error del inicio de sesión
export interface ErrorIniciarSesionResponse {
  mensaje: string; // Un mensaje de error descriptivo
  codigo?: number; // Un código de error opcional
}

@Injectable({
  providedIn: 'root'
})
export class IniciarSesionService {

  private apiUrl = 'http://localhost:3000/api/usuarios/iniciar-sesion';

  // BehaviorSubject para rastrear el estado de inicio de sesión
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  iniciarSesion(email: string, contraseña: string): Observable<IniciarSesionResponse> {
    const body = { email, contraseña };
    return this.http.post<IniciarSesionResponse>(this.apiUrl, body)
      .pipe(
        tap(response => {
          console.log('Inicio de sesión exitoso', response);
          localStorage.setItem('token', response.token);
          this.isLoggedInSubject.next(true);
        }),
        catchError(this.handleServerError)
      );
  }

  // Método para obtener el estado de inicio de sesión
  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  // Método para establecer el estado de inicio de sesión
  setLoggedInState(isLoggedIn: boolean) {
    this.isLoggedInSubject.next(isLoggedIn);
  }

  private handleServerError(error: any): Observable<never> {
    console.error('Error en el inicio de sesión', error);

    const errorMessage: ErrorIniciarSesionResponse = {
      mensaje: 'Error desconocido en el inicio de sesión'
    };

    if (error.status === 401) {
      errorMessage.mensaje = 'Credenciales inválidas';
    }

    return throwError(errorMessage);
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
  }
}