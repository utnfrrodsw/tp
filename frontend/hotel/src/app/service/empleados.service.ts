import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  private apiUrl = 'http://localhost:3000/auth/login/empleado'; 
  

  constructor(private http: HttpClient) { }

  login(mail: string, contrasena: string): Observable<any> {
    const body = { mail, contrasena };
    return this.http.post<any>(this.apiUrl, body).pipe(
      tap((response) => {
        if (response.token && response.dni && response.nombre) {
          // Almacenar token, DNI y nombre en localStorage
          this.storeTokenAndDniInLocalStorage(response.token, response.dni, response.nombre);
        }
      })
    );
  }

  // Almacenar token, DNI y nombre en localStorage
  storeTokenAndDniInLocalStorage(token: string, dni: number, nombre: string) {
    localStorage.setItem('empleadoToken', token);
    localStorage.setItem('empleadoDni', dni.toString());
    localStorage.setItem('empleadoNombre', nombre); // Almacenar nombre completo
    console.log('Token, DNI y nombre almacenados en localStorage');
  }

  // Obtener token desde localStorage
  getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('empleadoToken');
  }

  // Obtener DNI desde localStorage como número
  getDniFromLocalStorage(): number | null {
    const dni = localStorage.getItem('empleadoDni');
    return dni ? Number(dni) : null;
  }

  // Obtener nombre desde localStorage
  getNombreFromLocalStorage(): string | null {
    return localStorage.getItem('empleadoNombre');
  }

  // Limpiar token, DNI y nombre de localStorage
  clearTokenAndDniLocalStorage() {
    localStorage.removeItem('empleadoToken');
    localStorage.removeItem('empleadoDni');
    localStorage.removeItem('empleadoNombre'); // Eliminar nombre
    console.log('Token, DNI y nombre eliminados de localStorage');
  }

  // Método para verificar si un empleado está logueado
  isEmployeeLoggedIn(): boolean {
    const token = this.getTokenFromLocalStorage();
    const dni = this.getDniFromLocalStorage();

    // Si el token y el DNI están disponibles, consideramos que el empleado está logueado
    return !!token && !!dni;
  }
}
