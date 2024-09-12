import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Usuario, UsuarioModel } from '../../../../model/interfaces/usuario.interface.js';
import { Subscription } from 'rxjs';
import { UsuariosService } from '../../../../services/usuariosService/usuarios.service.js';
import { UsuariosBodyService } from './usuariosBody.service.js';


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent {
  usuarios: UsuarioModel[] = [];
  displayedColumns: string[] = ['nombre_usuario', 'rol'];
  columnNames: { [key: string]: string } = {
    nombre_usuario: 'usuario',
    rol: 'nivel de permisos',
  };

  usuarioSeleccionado: UsuarioModel | null = null;
  deletingRow: UsuarioModel | null = null;
  editingRow: UsuarioModel | null = null;
  editTemp: UsuarioModel = {
    id_usuario: 0,
    nombre_usuario: '',
    hash: '',
    rol: '',
  };

  isAddingNew: boolean = false;
  isEditing: boolean = false;

  private subscription = new Subscription();

  constructor(
    private usuariosBodyService: UsuariosBodyService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.subscription.add(
      this.usuariosService.usuario$.subscribe(
        (data) => {
          console.log('Data received:', data);
          this.usuarios = Object.values(data);
        },
        (error) => {
          console.error('Error al cargar los usuarios', error);
        }
      )
    );
  }

  onSeleccionarTipo(usuario: UsuarioModel): void {
    this.usuariosBodyService.select(
      usuario
    ); /*Servicio para marcar al tipo como "Selected" */
    console.log('Row clicked:', usuario);
  }

  delete(usuario: UsuarioModel): void {
    console.log('delete called');

    this.isAddingNew = false;
    this.isEditing = false;

    this.deletingRow = usuario;

    this.subscription.add(
      this.usuariosService
        .delete(this.deletingRow.id_usuario)
        .subscribe({
          next: () => {
            this.loadUsuarios(); // Refresh the list
          },
          error: (error) => {
            console.error('Error al eliminar el usuario', error);
          },
        })
    );
  }

  startEdit(usuario: UsuarioModel): void {
    console.log('StartEdit called');

    this.isAddingNew = false;
    this.isEditing = true;

    this.editingRow = usuario;
    this.editTemp = { ...usuario }; // Hago una copia de lo que estamos editando
  }

  saveEdit(): void {
    if (this.editTemp) {
      if (this.isAddingNew) {
        // Si estamos en modo "Agregar"
        this.addUsuario(this.editTemp);
        this.isAddingNew = false; // Resetear el modo "Agregar"
      } else {
        if (this.isEditing) {
          // Modo "Editar"
          this.subscription.add(
            this.usuariosService.update(this.editTemp).subscribe({
              next: () => {
                this.loadUsuarios(); // Refresh the list
                this.editingRow = null; // Exit edit mode
              },
              error: (error) => {
                console.error('Error al actualizar el Usuario', error);
              },
            })
          );
        }
      }
    }
  }

  cancelEdit(): void {
    this.isAddingNew = false;
    this.isEditing = false;
    this.editingRow = null; // Exit edit mode
  }

  onAdd(): void {
    const newUsuario: UsuarioModel = {
      id_usuario: 0,
      nombre_usuario: '',
      hash: '',
      rol:'',
    };
    this.usuarios.push(newUsuario);
    this.startEdit(newUsuario);
    this.usuariosBodyService.startAdding();
    this.isAddingNew = true;
    console.log('you pressed onAddProveedor in tiposVolquete-list.component');
  }

  addUsuario(usuario: UsuarioModel): void {
    this.subscription.add(
      this.usuariosService.add(usuario).subscribe({
        next: (newTipo) => {
          this.loadUsuarios();
        },
        error: (error) => {
          console.error('Error adding Usuario:', error);
        },
      })
    );
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy called');
    this.subscription.unsubscribe(); // Clean up subscriptions
  }
}
