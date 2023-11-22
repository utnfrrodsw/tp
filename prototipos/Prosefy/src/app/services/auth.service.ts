import { Injectable } from '@angular/core';
import { IniciarSesionService, IniciarSesionResponse } from './iniciar-sesion.service';
import { RegistroService, RegistroResponse } from './registro.service';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private failedLoginAttempts = 0;
  private isBlockedSubject = new BehaviorSubject<boolean>(false);

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

  private apiUrl = 'http://localhost:3000/api/usuarios/';

  constructor(
    private iniciarSesionService: IniciarSesionService,
    private registroService: RegistroService,
    private http: HttpClient
  ) { }

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

  getIdUsuarioPorToken(): Observable<string | null> {
    const token = this.getTokenFromLocalStorage();

    if (token) {
      const url = `${this.apiUrl}token/${token}`;
      return this.http.get<string>(url);
    } else {
      return new Observable<string | null>((observer) => {
        observer.next(null);
        observer.complete();
      });
    }
  }

  private getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('token');
  }
}

