import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Observable, tap, catchError, throwError } from "rxjs";
import { environment } from "../../environments/environment.development";
import { IniciarSesionResponse } from "./iniciar-sesion.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private failedLoginAttempts = 0; // Contador de intentos fallidos
  private isBlockedSubject = new BehaviorSubject<boolean>(false); // Estado de bloqueo

  private currentRoleSubject = new BehaviorSubject<string | null>(null);
  currentRole$ = this.currentRoleSubject.asObservable();

  setCurrentRole(role: string): void {
    this.currentRoleSubject.next(role);
  }

  getCurrentRole(): string | null {
    return this.currentRoleSubject.value;
  }

  // Método para iniciar sesión
  iniciarSesion(email: string, contraseña: string): Observable<IniciarSesionResponse> {
    return this.http.post<IniciarSesionResponse>(`${environment.apiUrlUsuarios}/iniciar-sesion`, { email, contraseña }).pipe(
      tap(response => {
        localStorage.setItem("token", response.token);
        this.setCurrentRole(response.usuario.tipo); // Guardar el rol del usuario
      }),
      catchError(this.handleServerError)
    );
  }

  // Método para cerrar sesión
  cerrarSesion() {
    localStorage.removeItem("token");
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(["/login"]);
  }

  // Verificar si el usuario está autenticado
  checkAuthStatus() {
    const token = localStorage.getItem("token");
    if (token) {
      this.isAuthenticatedSubject.next(true);
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  // Obtener el ID del usuario actual desde el token
  getCurrentUserId(): string | null {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar el token
      return payload.userId || null;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  }

  // Intentar iniciar sesión (bloqueo temporal después de 3 intentos fallidos)
  attemptLogin(): boolean {
    if (this.failedLoginAttempts >= 3) {
      this.isBlockedSubject.next(true);
      setTimeout(() => {
        this.isBlockedSubject.next(false);
        this.failedLoginAttempts = 0;
      }, 5 * 60 * 1000); // Bloquear durante 5 minutos
      return false;
    }
    return true;
  }

  // Incrementar el contador de intentos fallidos
  incrementFailedAttempts(): void {
    this.failedLoginAttempts++;
  }

  // Obtener el estado de bloqueo
  get isBlocked$() {
    return this.isBlockedSubject.asObservable();
  }

  // Manejo de errores
  private handleServerError(error: any): Observable<never> {
    console.error("Error en el inicio de sesión:", error);
    const errorMessage = {
      mensaje: "Error desconocido en el inicio de sesión",
    };
    if (error.status === 401) {
      errorMessage.mensaje = "Credenciales inválidas";
    }
    return throwError(() => errorMessage);
  }
}