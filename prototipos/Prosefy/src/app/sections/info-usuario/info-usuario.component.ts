import { Component } from '@angular/core';
import { UsuarioService, Usuario } from '../../services/usuario.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Edicion {
  nombre: boolean;
  email: boolean;
  apellido: boolean;
  username: boolean;
  localidad: boolean;
};

@Component({
  selector: 'app-info-usuario',
  templateUrl: './info-usuario.component.html',
  styleUrls: ['./info-usuario.component.css']
})
export class InfoUsuarioComponent {
  usuarioId: string | null = null;
  usuario: Usuario | undefined;
  editando = false;
  formulario: FormGroup;

  edicion = {
    nombre: false,
    email: false,
    apellido: false,
    username: false,
    localidad: false,
  };

  constructor(private usuarioService: UsuarioService, private authService: AuthService, private formBuilder: FormBuilder
  ) {
    this.formulario = this.formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // Agrega otros campos según sea necesario
    });
  }

  ngOnInit() {
    this.authService.getIdUsuarioPorToken().subscribe(
      (response: any) => {
        this.usuarioId = response.data.userId;
        console.log("Id de usuario:", this.usuarioId);

        if (this.usuarioId !== null) {
          this.usuarioService.getUsuarioPorId(this.usuarioId).subscribe(
            (usuario: Usuario) => {
              this.usuario = usuario;
              this.inicializarFormulario();
            },
            (error: any) => {
              console.error('Error obteniendo el usuario:', error);
            }
          );
        }
      },
      (error: any) => {
        console.error('Error obteniendo el usuario ID:', error);
      }
    );
  }

  inicializarFormulario() {
    if (this.usuario) {
      this.formulario.setValue({
        nombre: this.usuario.nombre || '',
        email: this.usuario.email || '',
        // Inicializa otros campos según sea necesario
      });
    }
  }


  toggleEdicion(campo: keyof Edicion) {
    this.edicion[campo] = !this.edicion[campo];
  }

  guardarCambios() {
    if (this.formulario.valid) {
      // Aquí puedes enviar el formulario actualizado al servidor
      console.log('Formulario válido:', this.formulario.value);
      // También puedes desactivar el modo de edición
      this.editando = false;
    } else {
      console.log('Formulario inválido. Revisa los campos.');
    }
  }
}