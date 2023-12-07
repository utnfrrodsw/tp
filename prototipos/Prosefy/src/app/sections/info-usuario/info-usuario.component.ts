import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { ProvinciasService } from 'src/app/services/provincias.service';

interface Edicion {
  nombre: boolean;
  email: boolean;
  apellido: boolean;
  username: boolean;
  direccion: boolean;
  provincia: boolean;
};

@Component({
  selector: 'app-info-usuario',
  templateUrl: './info-usuario.component.html',
  styleUrls: ['./info-usuario.component.css']
})
export class InfoUsuarioComponent implements OnInit {
  usuario: any = {};
  editando = false;
  isPopupOpen: boolean = false;
  modalMessage: string = '';

  closePopup(): void {
    this.isPopupOpen = false;
  }

  edicion = {
    nombre: false,
    email: false,
    apellido: false,
    username: false,
    direccion: false,
    provincia: false,
  };

  provincias: string[] = [];
  provinciaSeleccionada: string = '';

  constructor(private usuarioService: UsuarioService, private provinciasService: ProvinciasService) { }

  ngOnInit() {
    // Obtener los valores del usuario y asignarlos a las propiedades del componente
    this.usuarioService.getNombre().subscribe({
      next: (data: any) => {
        this.usuario.nombre = data.data.nombre;
      },
      error: (error: any) => {
        console.error('Error obteniendo nombre:', error);
      }
    });

    this.usuarioService.getApellido().subscribe({
      next: (data: any) => {
        this.usuario.apellido = data.data.apellido;
      },
      error: (error: any) => {
        console.error('Error obteniendo apellido:', error);
      }
    });

    this.usuarioService.getEmail().subscribe({
      next: (data: any) => {
        this.usuario.email = data.data.email;
      },
      error: (error: any) => {
        console.error('Error obteniendo email:', error);
      }
    });

    this.usuarioService.getUsername().subscribe({
      next: (data: any) => {
        this.usuario.username = data.data.username;
      },
      error: (error: any) => {
        console.error('Error obteniendo nombre de usuario:', error);
      }
    });

    this.usuarioService.getDireccion().subscribe({
      next: (data: any) => {
        this.usuario.direccion = data.data.direccion;
      },
      error: (error: any) => {
        console.error('Error obteniendo dirección de usuario:', error);
      }
    });

    this.provinciasService.getProvincias().subscribe({
      next: (data: any) => {
        this.provincias = data;
      },
      error: (error: any) => {
        console.error('Error obteniendo provincias:', error);
      }
    });
  }


  toggleEdicion(campo: keyof Edicion) {
    this.edicion[campo] = !this.edicion[campo];
  }

  guardarCambios() {
    // Itera sobre los campos en edición y actualiza
    (Object.keys(this.edicion) as (keyof Edicion)[]).forEach((campo: keyof Edicion) => {
      if (this.edicion[campo] && this.usuario[campo] !== '') {
        this.actualizarCampo(campo, this.usuario[campo]);
      }
    });
  }

  actualizarCampo(campo: keyof Edicion, nuevoValor: any) {
    console.log(`Actualizando campo ${campo} con nuevo valor: ${nuevoValor}`);
    switch (campo) {
      case 'nombre':
        this.usuarioService.setNombre(nuevoValor).subscribe({
          next: (response) => {
            console.log(`Éxito al actualizar ${campo}:`, response);
            this.edicion[campo] = false;
            this.mostrarMensaje('¡Actualización exitosa!');
          },
          error: (error) => this.mostrarMensaje('Error al actualizar ' + campo)
        });
        break;
      case 'apellido':
        this.usuarioService.setApellido(nuevoValor).subscribe({
          next: (response) => {
            console.log(`Éxito al actualizar ${campo}:`, response);
            this.edicion[campo] = false;
            this.mostrarMensaje('¡Actualización exitosa!');
          },
          error: (error) => this.mostrarMensaje('Error al actualizar ' + campo)
        });
        break;
      case 'email':
        this.usuarioService.setEmail(nuevoValor).subscribe({
          next: (response) => {
            console.log(`Éxito al actualizar ${campo}:`, response);
            this.edicion[campo] = false;
            this.mostrarMensaje('¡Actualización exitosa!');
          },
          error: (error) => this.mostrarMensaje('Error al actualizar ' + campo)
        });
        break;
      case 'username':
        this.usuarioService.setUsername(nuevoValor).subscribe({
          next: (response) => {
            console.log(`Éxito al actualizar ${campo}:`, response);
            this.edicion[campo] = false;
            this.mostrarMensaje('¡Actualización exitosa!');
          },
          error: (error) => this.mostrarMensaje('Error al actualizar ' + campo)
        });
        break;
      case 'direccion':
        this.usuarioService.setDireccion(nuevoValor).subscribe({
          next: (response) => {
            console.log(`Éxito al actualizar ${campo}:`, response);
            this.edicion[campo] = false;
            this.mostrarMensaje('¡Actualización exitosa!');
          },
          error: (error) => this.mostrarMensaje('Error al actualizar ' + campo)
        });
        break;
      case 'provincia':
        this.actualizarProvincia(nuevoValor);
        break;
      default:
        console.log(`Campo no manejado: ${campo}`);
        this.mostrarMensaje('El campo ' + campo + ' no se puede actualizar.')
    }
  }

  actualizarProvincia(descripcion: string) {
    this.provinciasService.getProvinciaByDescripcion(descripcion).subscribe({
      next: (provincia: any) => {
        if (provincia && provincia._id) {
          this.usuario.idProvincia = provincia._id;
          console.log('ID de la provincia actualizada:', this.usuario.idProvincia);

          this.usuarioService.setProvincia(this.usuario.idProvincia).subscribe({
            next: (response) => {
              console.log('Éxito al actualizar la provincia del usuario:', response);
              this.edicion['provincia'] = false;
              this.mostrarMensaje('¡Actualización exitosa!');
            },
            error: (error) => console.error('Error al actualizar la provincia del usuario:', error)
          });
        } else {
          console.error('No se encontró la provincia con la descripción:', descripcion);
          this.mostrarMensaje('No se encontró la provincia con la descripción ' + descripcion)
        }
      },
      error: (error) => console.error('Error al obtener la provincia por descripción:', error)
    });
  }

  mostrarMensaje(mensaje: string) {
    this.modalMessage = mensaje;
    this.isPopupOpen = true;
  }
}