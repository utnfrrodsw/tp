import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  onSubmit() {
    // Para autenticficar
    if (this.username === 'usuario' && this.password === 'contraseña') {
      console.log('Inicio de sesión exitoso');
    } else {
      console.log('Credenciales incorrectas');
    }
  }
}
