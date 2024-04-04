import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.sass'],
})
export class LoginFormComponent {
  hide = true;
  formLogin = this.formBuilder.group({
    userName: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(25)],
    ],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });
  deletionMessage: string = '';
  succesMessage: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  handlerLogin() {
    if (this.formLogin.valid) {
      this.authService
        .login(
          this.formLogin.controls['userName'].value ?? '',
          this.formLogin.controls['password'].value ?? ''
        )
        .subscribe(
          () => {
            this._snackBar.open('Sesión iniciada exitosamente!', 'X', {
              duration: 4000,
            });
            this.router.navigate(['money']);
          },
          () => {
            this.deletionMessage = 'Usuario o contraseña invalida';
          }
        );
    }
  }

  handlerSignUp() {
    this.router.navigate(['create-user']);
  }
}
