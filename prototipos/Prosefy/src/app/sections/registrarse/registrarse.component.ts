import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css'],
})
export class RegistrarseComponent {
  registroForm: FormGroup;
  showErrorMessages: boolean = false; // Variable para controlar la visualización de mensajes de error

  //TODO: Las validaciones no funcionan del todo bien todavía

  constructor(private formBuilder: FormBuilder) {
    this.registroForm = this.formBuilder.group(
      {
        nombre: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-Z]+$/), // Aceptar solo letras de a-z o A-Z
          ],
        ],
        apellido: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-Z]+$/), // Aceptar solo letras de a-z o A-Z
          ],
        ],
        username: [
          '',
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+$/)], // Aceptar solo letras de a-z o A-Z, números de 0-9 y guión bajo
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])/),
          ],
        ],
        repeatPassword: [''],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  // Función para validar que las contraseñas coincidan
  passwordMatchValidator() {
    return (formGroup: FormGroup) => {
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
    };
  }

  // Función para registrar al usuario
  registrarUsuario() {
    this.showErrorMessages = true; // Mostrar mensajes de error al hacer clic en "Continuar"

    if (this.registroForm.valid) {
      // Realizar la acción de registro aquí
      // Por ejemplo, enviar datos al servidor
    }
  }
}
