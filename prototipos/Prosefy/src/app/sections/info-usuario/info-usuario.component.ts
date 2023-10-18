import { Component } from '@angular/core';
import { UsuarioService, Usuario } from '../../services/usuario.service';

@Component({
  selector: 'app-info-usuario',
  templateUrl: './info-usuario.component.html',
  styleUrls: ['./info-usuario.component.css']
})
export class InfoUsuarioComponent {

  usuarios: Usuario[] = [];

  constructor(private usuariosService: UsuarioService) {}

  ngOnInit() {
    this.usuarios = this.usuariosService.getUsuarios();
  }

}
