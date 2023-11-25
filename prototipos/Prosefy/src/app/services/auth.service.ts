import { Injectable } from '@angular/core';
import { IniciarSesionService, IniciarSesionResponse } from './iniciar-sesion.service';
import { RegistroService, RegistroResponse } from './registro.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  private failedLoginAttempts = 0;
  private isBlockedSubject = new BehaviorSubject<boolean>(false);

  private apiUrl = 'http://localhost:3000/api/usuarios/';

  constructor(
    private iniciarSesionService: IniciarSesionService,
    private registroService: RegistroService,
    private router: Router
  ) { }

  /* Si no está autenticado, se bloquea el acceso a ciertas rutas */
  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      return true; // Hay token, permitir acceso
    } else {
      this.router.navigate(['/inicio']);
      return false; // No hay token, bloquear acceso
    }
  }

  get isBlocked$(): Observable<boolean> {
    return this.isBlockedSubject.asObservable();
  }

  attemptLogin(): boolean {
    if (this.failedLoginAttempts >= 3) {
      this.blockForDuration(); // Bloquear durante 5 minutos después de 3 intentos fallidos
      return false;
    }
    return true;
  }

  incrementFailedAttempts(): void {
    this.failedLoginAttempts++;
    console.log('Número de intentos fallidos:', this.getFailedLoginAttempts());
  }

  getFailedLoginAttempts(): number {
    return this.failedLoginAttempts;
  }

  private blockForDuration(): void {
    this.isBlockedSubject.next(true);
    setTimeout(() => {
      this.isBlockedSubject.next(false);
      this.failedLoginAttempts = 0;
    }, 5 * 60 * 1000); // Bloquear durante 5 minutos
  }

  iniciarSesion(email: string, contraseña: string): Observable<IniciarSesionResponse> {
    return this.iniciarSesionService.iniciarSesion(email, contraseña).pipe(
    );
  }

  registrarUsuario(usuario: any): Observable<RegistroResponse> {
    return this.registroService.registrarUsuario(usuario).pipe(
    );
  }

  cerrarSesion(): void {
    this.iniciarSesionService.cerrarSesion();
  }

  checkToken(): void {
    this.iniciarSesionService.checkToken();
  }
}