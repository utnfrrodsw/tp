import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Usuario {

  id: number;
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

  private usuarios: Usuario[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'JuanPerez@gmail.com',
      direccion: 'Direccion 1',
      localidad: 'Localidad 1',
      avatar: '../../../../assets/img/usuaio.png',
      tipo: 'Administrador'
    }
  ]
  
  constructor(private http: HttpClient) {}

  registrarUsuario(user: any): Observable<any> {
    return this.http.post("https://localhost:3000/api/usuarios", user);
  }


  getUsuarios(): Usuario[] {
    return this.usuarios;
  }
  
}
