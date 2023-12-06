import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError, combineLatest } from "rxjs";
import { catchError, map } from 'rxjs/operators';
import { IniciarSesionService } from './iniciar-sesion.service';
import { environment } from 'src/environments/environment.development';

export interface Usuario {
  _id?: string;
  username: string;
  nombre: string;
  apellido: string;
  email: string;
  direccion?: string;
  localidad?: string;
  avatar?: string;
  tipo: string;
  contraseña?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl: string = environment.apiUrlUsuarios;

  constructor(private http: HttpClient, private iniciarSesionService: IniciarSesionService) { }

  eliminarCuenta(): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError(() => 'No se encontró un token en el almacenamiento local.');
    }
    const options = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    localStorage.removeItem('token');
    this.iniciarSesionService.checkToken();
    return this.http.delete(this.apiUrl, options);
  }

  findAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/`).pipe(
      catchError(error => {
        console.error('Error obteniendo usuarios:', error);
        return throwError(() => 'Error en la solicitud al servidor.');
      })
    );
  }

  eliminarUsuario(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  // GETTERS CON PERMISOS (TOKEN)

  getNombre(): Observable<{ data: { nombre: string } }> {
    const endpoint = "get-nombre";
    return this.getData(endpoint);
  }

  getApellido(): Observable<{ data: { apellido: string } }> {
    const endpoint = "get-apellido";
    return this.getData(endpoint);
  }

  getEmail(): Observable<{ data: { email: string } }> {
    const endpoint = "get-email";
    return this.getData(endpoint);
  }

  getUsername(): Observable<{ data: { username: string } }> {
    const endpoint = "get-username";
    return this.getData(endpoint);
  }

  getTipo(): Observable<{ data: { tipo: string } }> {
    const endpoint = "get-tipo";
    return this.getData(endpoint);
  }

  private getData(endpoint: string): Observable<any> {
    const token = localStorage.getItem('token');

    const url = `${this.apiUrl}/${endpoint}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(url, { headers }).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error obteniendo datos:', error);
        return throwError(() => 'Error en la solicitud al servidor.');
      })
    );
  }

  // GETTERS

  getNombreById(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/get-nombre/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getApellidoById(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/get-apellido/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getEmailById(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/get-email/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getUsernameById(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/get-username/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getTipoById(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/get-tipo/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getAvatarById(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/get-avatar/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getUsuariosIds(): Observable<string[]> {
    return this.http.get<any>(`${this.apiUrl}/usuarios`).pipe(
      map((response: any) => response.data)
    );
  }

  // SETTERS

  private setData<T>(setter: string, value: string): Observable<T> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró un token en el almacenamiento local.');
    }

    const url = `${this.apiUrl}/${setter}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const body = {
      sanitizedInput: {
        [setter]: value,
      },
    };

    return this.http.put<T>(url, body, { headers });
  }

  setNombre(nombre: string): Observable<any> {
    return this.setData('set-nombre', nombre);
  }

  setApellido(apellido: string): Observable<any> {
    return this.setData('set-apellido', apellido);
  }

  setEmail(email: string): Observable<any> {
    return this.setData('set-email', email);
  }

  setUsername(username: string): Observable<any> {
    return this.setData('set-username', username);
  }

  setTipo(tipo: string): Observable<any> {
    return this.setData('set-tipo', tipo);
  }

  actualizarUsuario(usuarioId: string, datosActualizados: any): Observable<any> {
    const url = `${this.apiUrl}/${usuarioId}`;
    return this.http.put(url, { sanitizedInput: datosActualizados });
  }

}