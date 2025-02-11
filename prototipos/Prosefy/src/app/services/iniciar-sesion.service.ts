import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';

export interface IniciarSesionResponse {
  token: string;
  usuario: {
    id: string;
    nombre: string;
    email: string;
    tipo: string;
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

  private apiUrl: string = environment.apiUrlUsuarios;

  // BehaviorSubject para rastrear el estado de inicio de sesión
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  checkToken(): void {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = { Authorization: `Bearer ${token}` };
      const url = `${this.apiUrl}/check-token`;

      this.http.get(url, { headers }).pipe(
        tap(() => {
          console.log('Token válido.');
          this.isLoggedInSubject.next(true);
        }),
        catchError(error => {
          console.log('Token no válido o expirado.');
          this.isLoggedInSubject.next(false);
          localStorage.removeItem('token');
          return throwError(() => error);
        })
      ).subscribe();
    } else {
      console.log('No hay token almacenado.');
      this.isLoggedInSubject.next(false);
    }
  }

  iniciarSesion(email: string, contraseña: string): Observable<IniciarSesionResponse> {
    const body = { email, contraseña };
    return this.http.post<IniciarSesionResponse>(`${this.apiUrl}/iniciar-sesion`, body)
      .pipe(
        tap(response => {
          console.log('Inicio de sesión exitoso', response);

          if (response.token) {
            console.log('Token guardado durante el inicio de sesión:', response.token);
            localStorage.setItem('token', response.token);
            this.checkToken();
          } else {
            console.error('Respuesta del servidor sin token', response);
          }
        }),
        catchError(this.handleServerError)
      );
  }

  // Método para obtener el estado de inicio de sesión
  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  cerrarSesion(): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Token enviado al cerrar sesión:', token);
    const url = `${this.apiUrl}/cerrar-sesion`;

    if (!token) {
      console.log('No hay token para cerrar sesión.');
      return throwError(() => { mensaje: 'No hay token para cerrar sesión.' });
    }

    const headers = { Authorization: `Bearer ${token}` };

    return this.http.post(url, { token }, { headers }).pipe(
      tap(response => {
        console.log('Respuesta del servidor al cerrar sesión:', response);
        localStorage.removeItem('token');
        this.checkToken();
      }),
      catchError(error => {
        if (error.status === 401 && error.error.message === 'El token ha expirado.') {
          console.log('Error al cerrar sesión: El token ha expirado.');
          localStorage.removeItem('token');
          this.checkToken();
        } else {
          console.error('Error al cerrar sesión:', error);
        }
        // Manejar el error de cerrar sesión
        return throwError(() => error);
      })
    );
  }

  private handleServerError(error: any): Observable<never> {
    console.error('Error en el inicio de sesión', error);

    const errorMessage: ErrorIniciarSesionResponse = {
      mensaje: 'Error desconocido en el inicio de sesión'
    };

    if (error.status === 401) {
      errorMessage.mensaje = 'Credenciales inválidas';
    }

    return throwError(() => errorMessage);
  }
}