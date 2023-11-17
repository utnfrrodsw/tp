import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/services/Auth/LoginRequest';
import { IniciarSesionService, IniciarSesionResponse } from 'src/app/services/iniciar-sesion.service';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css']
})
export class IniciarSesionComponent implements OnInit {
  loginError: string = "";
  loginGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private router: Router,
    private iniciarSesionService: IniciarSesionService
  ) { }

  ngOnInit() {
    // Verifica el estado de inicio de sesión al iniciar el componente
    this.iniciarSesionService.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn === true) {
        // Si ya hay una sesión iniciada, redirige a la página de inicio
        this.router.navigateByUrl('/inicio');
      }
    });
  }

  login() {
    const email = this.loginGroup.get('email')?.value ?? '';
    const password = this.loginGroup.get('password')?.value ?? '';

    // Verifica el estado de inicio de sesión antes de intentar iniciar sesión
    this.iniciarSesionService.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn === true) {
        // Si ya hay una sesión iniciada, no permitas iniciar sesión nuevamente
        this.router.navigateByUrl('/inicio');
        return;
      }

      if (this.loginGroup.valid) {
        this.iniciarSesionService.iniciarSesion(email, password).subscribe(
          (response: IniciarSesionResponse) => {
            console.log('Inicio de sesión exitoso', response);
            // TODO: Almacena el token en el almacenamiento local

            this.router.navigateByUrl('/inicio');
          },
          (error) => {
            console.error('Error en el inicio de sesión', error);

            if (error.status === 401) {
              this.loginError = 'Credenciales inválidas. Verifica tu email y contraseña.';
            } else if (error.status === 404) {
              this.loginError = 'No hay ninguna cuenta registrada con el email introducido.';
            } else {
              this.loginError = error.mensaje || 'Error desconocido en el inicio de sesión';
            }
          }
        );
      } else {
        this.loginGroup.markAllAsTouched();
      }
    });
  }
}