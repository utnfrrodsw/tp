import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const loginData = {
      email: this.email,
      contrasena: this.password
    };

    // Realiza la petición al backend con la URL correcta
    this.http.post('http://localhost:3000/auth/login', loginData).subscribe({
      next: (response: any) => {
        // Si la autenticación es exitosa, recibirás un token
        const token = response.token;

        // Almacenar el token en localStorage o sessionStorage
        localStorage.setItem('authToken', token);

        this.router.navigate(['/']);

        
      },
      error: (err) => {
        // Manejar el error de autenticación
        alert('Error en el inicio de sesión. Verifique sus credenciales.');
      },
      complete: () => {
        // Este bloque se ejecuta cuando el observable se completa
        console.log('Autenticación completada.');
      }
    });
  }
}
