import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { RegistroService, RegistroResponse, Usuario } from 'src/app/services/registro.service';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css'],
})
export class RegistrarseComponent {
  registroForm: FormGroup;
  showErrorMessages: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public usuariosService: UsuarioService,
    private registroService: RegistroService
  ) {
    this.registroForm = this.formBuilder.group(
      {
        username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
        nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
        apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])/)],
        ],
        repeatPassword: [''],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  login() {
    const user = this.registroForm.value;
    console.log(user);

    this.usuariosService.registrarUsuario(user).subscribe((data) => {
      console.log('Se realizó el post de usuario');
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const repeatPasswordControl = formGroup.get('repeatPassword');

    if (passwordControl && repeatPasswordControl) {
      const password = passwordControl.value;
      const repeatPassword = repeatPasswordControl.value;

      if (password !== repeatPassword) {
        repeatPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        repeatPasswordControl.setErrors(null);
      }
    }
  }

  registrarUsuario(): void {
    console.log('Se hizo clic en el botón Continuar');
    this.showErrorMessages = true;

    if (this.registroForm.valid) {
      console.log('El formulario es válido. Realizar una llamada API.');
      const usuario: Usuario = this.registroForm.value;

      this.registroService.registrarUsuario(usuario).subscribe(
        (response: RegistroResponse) => {
          console.log('Registro exitoso', response);
        },
        (error) => {
          console.error('Error al registrar el usuario', error);
        }
      );
    }
  }
}