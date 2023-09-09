import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css'],
})
export class RegistrarseComponent {
  registroForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.registroForm = this.formBuilder.group(
      {
        nombre: [''],
        apellido: [''],
        username: [''],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])/), // Al menos una mayúscula y una minúscula
          ],
        ],
        repeatPassword: [''],
      },
      { validator: this.passwordMatchValidator() }
    );
  }

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

  registrarUsuario() {
    if (this.registroForm.valid) {
      // Verifica si el formulario es válido antes de registrar al usuario
      const user = this.registroForm.value; // Obtiene los datos del formulario
      console.log('Usuario registrado exitosamente', user);
    } else {
      // El formulario no es válido, muestra un mensaje de error o toma otras acciones necesarias
      console.error('El formulario no es válido');
    }
  }
}
