import { Component, OnInit } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-crud-usuarios',
  templateUrl: './crud-usuarios.component.html',
  styleUrls: ['./crud-usuarios.component.css']
})
export class CrudUsuariosComponent implements OnInit {

  usuarioEditandoId: string | null = null;
  nuevoTipo: string = '';

  constructor(private usuarioService: UsuarioService) { }

  usuariosIds: string[] = [];
  usuariosData: { [key: string]: { username: string | undefined, nombre: string | undefined, apellido: string | undefined, email: string | undefined, avatar: string | undefined, tipo: string | undefined } } = {};

  ngOnInit() {
    this.usuarioService.getUsuariosIds().subscribe((usuariosIds: string[]) => {
      this.usuariosIds = usuariosIds;

      const requests = usuariosIds.map(id =>
        forkJoin({
          username: this.usuarioService.getUsernameById(id),
          nombre: this.usuarioService.getNombreById(id),
          apellido: this.usuarioService.getApellidoById(id),
          email: this.usuarioService.getEmailById(id),
          avatar: this.usuarioService.getAvatarById(id),
          tipo: this.usuarioService.getTipoById(id)
        }).pipe(
          map(({ username, nombre, apellido, email, avatar, tipo }) => ({
            id,
            username: username,
            nombre: nombre,
            apellido: apellido,
            email: email,
            avatar: avatar || 'assets/img/usuario.png',
            tipo: tipo
          }))
        )
      );

      forkJoin(requests).subscribe((usuarios) => {
        usuarios.forEach(usuario => {
          this.usuariosData[usuario.id] = {
            username: usuario.username,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            avatar: usuario.avatar,
            tipo: usuario.tipo
          };
        });
      });
    });
  }

  eliminarUsuario(usuarioId: string): void {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(usuarioId).subscribe(
        () => {
          console.log('Usuario eliminado con éxito');
          location.reload();
        },
        (error) => {
          console.error('Error al eliminar el usuario', error);
        }
      );
    }
  }

  editarUsuario(usuarioId: string): void {
    if (this.usuarioEditandoId === usuarioId) {
      this.usuarioService.setTipo(usuarioId, this.nuevoTipo).subscribe(
        (response) => {
          console.log('Tipo actualizado con éxito:', response);
          window.location.reload();
        },
        (error) => {
          console.error('Error al actualizar el tipo:', error);
        }
      );
    }

    this.usuarioEditandoId = (this.usuarioEditandoId === usuarioId) ? null : usuarioId;
    this.nuevoTipo = '';
  }
}