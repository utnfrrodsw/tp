import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserInterface } from '../../model/interfaces/user.interface.js';
import { AuthService } from '../../services/authService/auth.service.js';
import { Router, ROUTER_CONFIGURATION } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  //Codigo visto en MonsterLessons Academy: "Angular Authentication, The correct way"
  fb = inject(FormBuilder);
  http=inject(HttpClient);
  authService=inject(AuthService)
  router = inject(Router);
  
  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    console.log('register');
    this.http.post<{user:UserInterface}>(
      'http://api.realworld.io/api/users',
      {
        user: this.form.getRawValue(),
      }).subscribe((response)=>{
        console.log('response', response);
        localStorage.setItem('token',response.user.token);
        this.authService.currentUserSig.set(response.user); //De esta forma se está notificando
        // a toda la aplicación que tenemos este nuevo usuario. Así te registrás y arrancás.
        this.router.navigateByUrl('/');
      });
  }
}
