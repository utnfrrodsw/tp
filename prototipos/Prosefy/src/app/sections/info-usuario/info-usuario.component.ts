import { Component, OnInit } from '@angular/core';
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
export class InfoUsuarioComponent implements OnInit {
  usuario: any = {};
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
    this.usuarioService.getNombre().subscribe(
      (data: any) => {
        this.usuario.nombre = data.data.nombre;
      },
      (error: any) => {
        console.error('Error obteniendo nombre:', error);
      }
    );

    this.usuarioService.getApellido().subscribe(
      (data: any) => {
        this.usuario.apellido = data.data.apellido;
      },
      (error: any) => {
        console.error('Error obteniendo apellido:', error);
      }
    );

    this.usuarioService.getEmail().subscribe(
      (data: any) => {
        this.usuario.email = data.data.email;
      },
      (error: any) => {
        console.error('Error obteniendo email:', error);
      }
    );

    this.usuarioService.getUsername().subscribe(
      (data: any) => {
        this.usuario.username = data.data.username;
      },
      (error: any) => {
        console.error('Error obteniendo nombre de usuario:', error);
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