import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroService } from '../service/registro.service';
 // Ajusta la ruta según tu estructura

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private registroService: RegistroService) {
    this.registerForm = this.fb.group({
      docType: ['', Validators.required],
      docNumber: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      birthdate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const clienteData = {
        nroDni: this.registerForm.value.docNumber,
        tipoDni: this.registerForm.value.docType,
        apellidoYnombre: `${this.registerForm.value.lastName} ${this.registerForm.value.firstName}`,
        sexo: this.registerForm.value.gender,
        fechaNac: new Date(this.registerForm.value.birthdate).toISOString(),
        email: this.registerForm.value.email,
        contrasena: this.registerForm.value.password
      };

      this.registroService.crearCliente(clienteData).subscribe(
        response => {
          console.log('Cliente registrado exitosamente', response);
          // Redirigir o mostrar un mensaje de éxito
        },
        error => {
          console.error('Error al registrar el cliente', error);
          // Mostrar un mensaje de error
        }
      );
    } else {
      // Mostrar un mensaje de error si el formulario es inválido
    }
  }
}
