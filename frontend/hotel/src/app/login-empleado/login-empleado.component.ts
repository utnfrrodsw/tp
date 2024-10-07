import { Component } from '@angular/core';

@Component({
  selector: 'app-login-empleado',
  templateUrl: './login-empleado.component.html',
  styleUrl: './login-empleado.component.css'
})
export class LoginEmpleadoComponent {

  email: string = '';
  password: string = '';

  onSubmit() {
    // Lógica para manejar el inicio de sesión
    console.log('Email:', this.email);
    console.log('Contraseña:', this.password);
    // Aquí puedes agregar la llamada a tu servicio de autenticación
  }

}
