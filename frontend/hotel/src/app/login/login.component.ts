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
        const nombreCliente = response.nombre; 

        // Ahora se llama a storeToken con los 3 argumentos
        this.authService.storeToken(token, idCliente, nombreCliente);
        
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
