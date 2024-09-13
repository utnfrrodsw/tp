import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  userName: string = '';

  constructor(private router: Router) {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    // Verificar si hay un token en localStorage
    const token = localStorage.getItem('authToken');
    this.isLoggedIn = !!token;
    if (this.isLoggedIn) {
      // Suponiendo que tienes un método para obtener el nombre del usuario
      // Aquí solo simulamos con un nombre de usuario fijo
      this.userName = 'Usuario';
    }
  }

  logout() {
    // Eliminar el token y redirigir al inicio
    localStorage.removeItem('authToken');
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
}
