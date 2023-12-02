import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IniciarSesionService, IniciarSesionResponse } from 'src/app/services/iniciar-sesion.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css']
})
export class IniciarSesionComponent {

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private iniciarSesionService: IniciarSesionService,
    private authService: AuthService
  ) { }

  loginError: string = "";
  loginGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  isPopupOpen: boolean = false;
  modalMessage: string = '';

  closePopup() {
    this.isPopupOpen = false;
  }

  login() {
    const email = this.loginGroup.get('email')?.value ?? '';
    const password = this.loginGroup.get('password')?.value ?? '';

    if (this.loginGroup.valid) {

      // Verificar el bloqueo antes de intentar iniciar sesión
      if (!this.authService.attemptLogin()) {
        this.loginError = `Intenta nuevamente dentro de 5 minutos.`;
        this.updateModalContent('Demasiados intentos fallidos. Intenta nuevamente más tarde.');
        return;
      }
  
      this.iniciarSesionService.iniciarSesion(email, password).subscribe({
        next: (response: IniciarSesionResponse) => {
          console.log('Inicio de sesión exitoso', response);
          this.router.navigateByUrl('/inicio');
        },
        error: (error) => {
          console.error('Error en el inicio de sesión', error);
          this.authService.incrementFailedAttempts();
          this.loginError = 'Verifica tu email y contraseña.';
          this.updateModalContent('Credenciales inválidas. Por favor, vuelva a intentar.');
        }
      });
    } else {
      this.loginGroup.markAllAsTouched();
    }
  }

  private updateModalContent(message: string): void {
    this.modalMessage = message;
    this.isPopupOpen = true;
  }
}
