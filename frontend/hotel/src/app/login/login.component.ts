import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        const token = response.token;
        const idCliente = response.idCliente;
        this.authService.storeToken(token, idCliente);
        
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert('Error en el inicio de sesión. Verifique sus credenciales.');
      },
      complete: () => {
        console.log('Autenticación completada.');
      }
    });
  }
}
