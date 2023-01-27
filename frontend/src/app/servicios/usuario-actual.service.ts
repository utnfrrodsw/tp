import { Injectable } from '@angular/core';
import { Usuario } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioActualService {

  // TODO Esto no me gusta.
  usuarioActual:(Usuario|null) =null;

  setUsuarioActual(usuario:Usuario) {
    this.usuarioActual = usuario;
  }

  getUsuarioActual(){
    return this.usuarioActual;
  }
}
