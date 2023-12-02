import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { RegistroService, RegistroResponse } from 'src/app/services/registro.service';
import { Usuario } from '../../services/usuario.service';
@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css'],
})
export class RegistrarseComponent {
  registroForm: FormGroup;
  showErrorMessages: boolean = false;
  isPopupOpen: boolean = false;
  modalMessage: string = '';
  showRedirectButton: boolean = false;

  @Output() closed = new EventEmitter<void>();
  tipoUsuario: string = 'usuario';

  closePopup() {
    this.isPopupOpen = false;
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public usuariosService: UsuarioService,
    private registroService: RegistroService,
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
    this.showErrorMessages = true;

    if (this.registroForm.valid) {

      const usernameControl = this.registroForm.get('username');
      const emailControl = this.registroForm.get('email');

      if (!usernameControl || !emailControl) {
        return;
      }

      const userUsername = usernameControl.value;
      const userEmail = emailControl.value;

      // Validar si el usuario ya existe antes de realizar el registro
      this.registroService.validarUsuarioExistente(userUsername).subscribe({
        next: (usuarioExistente) => {
          if (usuarioExistente !== null) {
            usernameControl.setErrors({ usuarioExistente: true });
            console.error('El nombre de usuario ya está en uso. Por favor, intente con otro.');
            this.updateModalContent('El nombre de usuario ya está en uso. Por favor, intente con otro.');
          } else {
            // Validar si el correo electrónico ya está registrado
            this.registroService.validarEmailExistente(userEmail).subscribe({
              next: (emailExistente) => {
                if (emailExistente !== null) {
                  emailControl.setErrors({ emailExistente: true });
                  console.error('El correo electrónico ya está registrado. Por favor, utilice otro.');
                  this.updateModalContent('El correo electrónico ya está en uso. Por favor, intente con otro.');
                } else {
                  this.realizarRegistro();
                }
              },
              error: (error) => {
                console.error('Error al validar el correo electrónico', error);
                console.error('Detalles del error:', error);
              }
            });
          }
        },
        error: (error) => {
          console.error('Error al validar el usuario', error);
          console.error('Detalles del error:', error);

          if (error && error.error && error.error.mensaje) {
            this.updateModalContent(error.error.mensaje);
          } else {
            const errorMessage = 'Error desconocido en el registro';
            this.updateModalContent(errorMessage);
          }
        }
      });
    }
  }

  private realizarRegistro(): void {

    const usuario: Usuario = {
      username: this.registroForm.value.username,
      nombre: this.registroForm.value.nombre,
      apellido: this.registroForm.value.apellido,
      email: this.registroForm.value.email,
      contraseña: this.registroForm.value.password,
      tipo: this.tipoUsuario
    };

    this.registroService.registrarUsuario(usuario).subscribe({
      next: (response: RegistroResponse) => {
        console.log('Registro exitoso', response);
        const message = 'Usuario registrado exitosamente.';
        this.updateModalContent(message, true);
      },
      error: (error) => {
        console.error('Error al registrar el usuario', error);

        // Imprime detalles específicos del error en la consola
        if (error && error.error && error.error.mensaje) {
          console.error('Detalles del error:', error.error.mensaje);
          this.updateModalContent(error.error.mensaje);
        } else {
          console.error('Error desconocido en el registro');
          const errorMessage = 'Error desconocido en el registro';
          this.updateModalContent(errorMessage);
        }
      }
    });
  }

  private updateModalContent(message: string, showRedirectButton: boolean = false): void {
    this.modalMessage = message;
    this.showRedirectButton = showRedirectButton;
    this.isPopupOpen = true;
  }

  redirectToLogin(): void {
    this.isPopupOpen = false;
    this.router.navigate(['/identificarse']);
  }
}