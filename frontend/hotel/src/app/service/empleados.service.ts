import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  private apiUrl = 'http://localhost:3000/auth/login/empleado'; 
  private empleadosUrl = 'http://localhost:3000/empleados'; // URL base para empleados

  constructor(private http: HttpClient) { }

  // Método de login
  login(mail: string, contrasena: string): Observable<any> {
    const body = { mail, contrasena };
    return this.http.post<any>(this.apiUrl, body);
  }

  // Almacenar token y DNI en localStorage
  storeTokenAndDniInLocalStorage(token: string, dni: number) {
    localStorage.setItem('empleadoToken', token);
    localStorage.setItem('empleadoDni', dni.toString()); // Almacenar el DNI como string
    console.log('Token y DNI almacenados en localStorage');
  }

  // Obtener token desde localStorage
  getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('empleadoToken');
  }

  // Obtener DNI desde localStorage como número
  getDniFromLocalStorage(): number | null {
    const dni = localStorage.getItem('empleadoDni');
    return dni ? Number(dni) : null; // Convertir a número si está disponible
  }

  // Limpiar token y DNI de localStorage
  clearTokenAndDniLocalStorage() {
    localStorage.removeItem('empleadoToken');
    localStorage.removeItem('empleadoDni');
    console.log('Token y DNI eliminados de localStorage');
  }

  // Obtener empleado por DNI usando el token
  getEmpleadoByDni(dni: number): Observable<any> {
    const token = this.getTokenFromLocalStorage();
    
    if (!token) {
      throw new Error('El token de empleado no está disponible.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.empleadosUrl}/${dni}`, { headers });
  }
}
