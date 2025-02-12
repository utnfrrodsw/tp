import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { UsuarioService } from './usuario.service';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private router: Router, private usuarioService: UsuarioService) { }

  canActivate() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/inicio']);
      return of(false);
    }
    return this.usuarioService.getTipo()
      .pipe(
        map(response => {
          if (response.data && response.data.tipo === 'admin') {
            return true; // Permite el acceso si el tipo de usuario es 'admin'
          } else {
            this.router.navigate(['/inicio']);
            return false; // Rechaza el acceso si el tipo de usuario no es 'admin'
          }
        }),
        catchError(error => {
          console.error('Error en getTipo:', error);
          this.router.navigate(['/inicio']);
          return of(false);
        })
      );
  }
}