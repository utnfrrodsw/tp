import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  eliminarCuenta() {
    this.usuarioService.eliminarCuenta().subscribe(
      () => {
        console.log('Usuario eliminado con éxito.');
        this.router.navigate(['/inicio']);
      },
      (error: any) => {
        console.error('Error al eliminar la cuenta:', error);
      }
    );
  }
}