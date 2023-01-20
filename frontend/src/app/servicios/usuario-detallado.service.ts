import { Injectable } from '@angular/core';
import { Usuario } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioDetalladoService {

  // TODO Esto no me gusta.
  usuarioDetallado:(Usuario|undefined) =undefined;

  setUsuarioDetallado(usuario:Usuario) {
    this.usuarioDetallado = usuario;
  }

  getUsuarioDetallado(){
    return this.usuarioDetallado;
  }
}
