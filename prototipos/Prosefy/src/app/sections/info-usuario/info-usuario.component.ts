import { Component } from '@angular/core';
import { UsuarioService, Usuario } from '../../services/usuario.service';

interface Edicion {
  nombre: boolean;
  email: boolean;
  apellido: boolean;
  username: boolean;
  contrasena: boolean;
  localidad: boolean;
  confirmarContrasena: boolean;
  codigoPostal: boolean;
  provincia: boolean;
};

@Component({
  selector: 'app-info-usuario',
  templateUrl: './info-usuario.component.html',
  styleUrls: ['./info-usuario.component.css']
})
export class InfoUsuarioComponent {

  usuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService) { }

  /*
  ngOnInit() {
    this.usuarios = this.usuarioService.getUsuarios();
  }*/

  editando = false;

  edicion = {
    nombre: false,
    email: false,
    apellido: false,
    username: false,
    contrasena: false,
    localidad: false,
    confirmarContrasena: false,
    codigoPostal: false,
    provincia: false
  };

  toggleEdicion(campo: keyof Edicion) {
    this.edicion[campo] = !this.edicion[campo];
  }
}