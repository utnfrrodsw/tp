import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of, map } from "rxjs";
import { LoginRequest } from './Auth/LoginRequest.js';

export interface Usuario {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  direccion: string;
  localidad: string;
  avatar: string;
  tipo: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl: string = "http://localhost:3000/api/usuarios";

  private usuarios: Usuario[] = [
    {
      _id: "1",
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'JuanPerez@gmail.com',
      direccion: 'Direccion 1',
      localidad: 'Localidad 1',
      avatar: '../../../../assets/img/usuaio.png',
      tipo: 'Administrador'
    }
  ]

  constructor(private http: HttpClient) { }

  registrarUsuario(user: any): Observable<any> {
    return this.http.post("https://localhost:3000/api/usuarios", user);
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.get('http://localhost:3000/api/usuarios')
  }

  getEmail(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/email/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getContraseña(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/contraseña/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getUsuariosIds(): Observable<string[]> {
    return this.http.get<any>(`${this.apiUrl}/usuarios`).pipe(
      map((response: any) => response.data)
    );
  }

  getUsuarios(): Usuario[] {
    return this.usuarios;
  }

  updateFlag(): boolean {
    return true;
  }

  getUserToken(): Observable<boolean> {
    const flag = this.updateFlag();
    // Si está True se puede acceder a la ruta
    return of(flag);
  }

}
