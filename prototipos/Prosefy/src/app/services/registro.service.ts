import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Usuario } from './usuario.service';
import { Router } from '@angular/router';
import { IniciarSesionService } from './iniciar-sesion.service';
import { environment } from 'src/environments/environment.development';

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

  private apiUrl: string = environment.apiUrlUsuarios;

  constructor(private http: HttpClient, private router: Router, private iniciarSesionService: IniciarSesionService) { }

  /* Si está autenticado, se bloquea el acceso a ciertas rutas */
  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      return true; // No hay token, permitir acceso
    } else {
      this.router.navigate(['/inicio']);
      return false; // Hay token, bloquear acceso
    }
  }

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
        }),
        catchError((error: HttpErrorResponse) => {
          return this.handleServerError(error);
        })
      );
  }

  validarUsuarioExistente(username: string): Observable<Usuario | null> {
    const url = `${this.apiUrl}/username/${username}`;
    return this.http.get<Usuario>(url)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return of(null);
          } else {
            return throwError(() => error);
          }
        })
      );
  }

  validarEmailExistente(email: string): Observable<Usuario | null> {
    const url = `${this.apiUrl}/email/${email}`;
    return this.http.get<Usuario>(url)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return of(null);
          } else {
            return throwError(() => error);
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

    return throwError(() => errorMessage);
  }
}
