import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EmpleadosService } from '../service/empleados.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-empleado',
  templateUrl: './login-empleado.component.html',
  styleUrls: ['./login-empleado.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginEmpleadoComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  imageLoaded: boolean = false;  

  constructor(private empleadosService: EmpleadosService, private router: Router) { }

  onSubmit() {
    this.empleadosService.login(this.email, this.password).subscribe({
      next: (response) => {
        const token = response.token;

        // Almacenar el token en localStorage
        this.empleadosService.storeTokenInLocalStorage(token);

        this.router.navigate(['/dashboard/empleado']);
      },
      error: (error) => {
        this.errorMessage = 'Usuario o contraseña incorrectos';
        console.error('Error durante el login:', error);
      }
    });
  }
}
