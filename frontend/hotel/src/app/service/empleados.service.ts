import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  private apiUrl = 'http://localhost:3000/auth/login/empleado'; 

  constructor(private http: HttpClient) { }

  login(mail: string, contrasena: string): Observable<any> {
    const body = { mail, contrasena };
    return this.http.post<any>(this.apiUrl, body);
  }

  // Función para almacenar el token en localStorage
  storeTokenInLocalStorage(token: string) {
    localStorage.setItem('empleadoToken', token); // Cambiado a empleadoToken
    console.log('Token almacenado en localStorage');
  }

  // Función para recuperar el token desde localStorage
  getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('empleadoToken'); // Cambiado a empleadoToken
  }

  // Función para eliminar el token de localStorage
  clearTokenLocalStorage() {
    localStorage.removeItem('empleadoToken'); // Cambiado a empleadoToken
    console.log('Token eliminado de localStorage');
  }
}
