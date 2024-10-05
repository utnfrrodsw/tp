import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInterface } from '../../model/interfaces/user.interface.js';
import { AuthService } from '../../services/authService/auth.service.js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  //Codigo visto en MonsterLessons Academy: "Angular Authentication, The correct way"
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    console.log('login');
    this.http
      .post<{ user: UserInterface }>('http://api.realworld.io/api/users/login', {
        user: this.form.getRawValue(),
      })
      .subscribe((response) => {
        console.log('response', response);
        localStorage.setItem('token', response.user.token);
        this.authService.currentUserSig.set(response.user); //De esta forma se está notificando
        // a toda la aplicación.
        this.router.navigateByUrl('/');
      });
  }
}
