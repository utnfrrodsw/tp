import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario, UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  usuarioId: string | null = null;
  usuario: Usuario | undefined;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.getIdUsuarioPorToken().subscribe(
      (usuarioId: string | null) => {
        this.usuarioId = usuarioId;

        if (this.usuarioId !== null) {
          this.usuarioService.getUsuarioPorId(this.usuarioId).subscribe(
            (usuario: Usuario) => {
              this.usuario = usuario;
            },
            (error: any) => {
              console.error('Error obteniendo el usuario:', error);
            }
          );
        }
      }
    );
  }

  eliminarCuenta() {
    if (this.usuarioId) {
      this.usuarioService.eliminarCuenta(this.usuarioId).subscribe(
        () => {
          console.log('Usuario eliminado con éxito.');

        },
        (error: any) => {
          console.error('Error al eliminar la cuenta:', error);
        }
      );
    }
  }
}  