import { Component, EventEmitter, Output } from '@angular/core';
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

  isPopupOpen: boolean = false;
  modalMessage: string = '';
  showRedirectButton: boolean = false;

  @Output() closed = new EventEmitter<void>();
  tipoUsuario: string = 'usuario';

  closePopup(): void {
    this.isPopupOpen = false;
  }

  eliminarCuenta(): void {
    this.isPopupOpen = true;
  }

  confirmarEliminarCuenta(): void {
    this.usuarioService.eliminarCuenta().subscribe({
      next: () => {
        console.log('Usuario eliminado con éxito.');
        this.router.navigate(['/inicio']);
      },
      error: (error: any) => {
        console.error('Error al eliminar la cuenta:', error);
      },
      complete: () => {
        this.isPopupOpen = false;
      }
    });
  }
}