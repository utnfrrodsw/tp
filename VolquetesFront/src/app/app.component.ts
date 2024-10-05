import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AppLayoutComponent } from './app-layout/app-layout.component.js';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/authService/auth.service.js';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from './model/interfaces/user.interface.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, RouterLink,
    AppLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'VolquetesFront';
  authService=inject(AuthService);
  http=inject(HttpClient)

  ngOnInit():void{
    this.http
      .get<{ user: UserInterface }>('https://api.realworld.io/api/user')
      .subscribe({
        next: (response) => {
          console.log('response:', response);
          this.authService.currentUserSig.set(response.user);
        },
        error:()=>{
          this.authService.currentUserSig.set(null);
        }
      });
  }
  
  logout():void{
    console.log('logout');
    localStorage.setItem('token','');
    this.authService.currentUserSig.set(null);
  }
  
}
