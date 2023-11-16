import { Injectable } from '@angular/core';
import { HttpClient, JsonpInterceptor } from "@angular/common/http";
import { Observable, of, map } from "rxjs";
import { LoginRequest } from './Auth/LoginRequest';

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
    return this.http.post(this.apiUrl, user);
  }

  login(usuario: LoginRequest): Observable<any>{
    const json = {
      id: 1,
      email: usuario.email,
      avatar: usuario.password
    }
    console.log(json)
    return this.http.post<LoginRequest>(this.apiUrl, {json})
  }

  getUsuarios(): Usuario[] {
    return this.usuarios;
  }

  getUserToken(): Observable<boolean> {
    return of(true);
  }

}
