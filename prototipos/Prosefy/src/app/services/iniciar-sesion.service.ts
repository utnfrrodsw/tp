// iniciar-sesion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

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

  private apiUrl = 'http://localhost:3000/api/usuarios';

  // BehaviorSubject para rastrear el estado de inicio de sesión
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  public checkToken(): void {
    const token = localStorage.getItem('token');

    if (token) {
      console.log('Token encontrado al cargar la aplicación:', token);
      this.isLoggedInSubject.next(true);
    } else {
      this.isLoggedInSubject.next(false);
      this.cerrarSesion().subscribe(
        () => console.log('Sesión cerrada exitosamente al cargar la aplicación'),
        error => console.error('Error al cerrar sesión al cargar la aplicación', error)
      );
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
            this.isLoggedInSubject.next(true);
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
    console.log('Cerrando sesión...');

    // Obtener el token almacenado en localStorage
    const token = localStorage.getItem('token');
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);

    // Verificar si hay un token antes de realizar la solicitud
    if (!token) {
      console.warn('No hay un token almacenado al intentar cerrar sesión.');
      return throwError('No hay un token almacenado.');
    }

    // Realizar la solicitud POST con el token en el encabezado
    return this.http.post<any>(`${this.apiUrl}/cerrar-sesion/${token}`, {}).pipe(
      tap(() => {
        console.log('Sesión cerrada exitosamente');
        localStorage.removeItem('token');
      }),
      catchError(error => {
        console.error('Error al cerrar sesión', error);
        // Agregar este bloque para manejar el error y emitir un mensaje si es necesario
        return throwError(error);
      }),
      finalize(() => {
        this.isLoggedInSubject.next(false);
        console.log('Cierre de sesión finalizado.');
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

    return throwError(errorMessage);
  }
}