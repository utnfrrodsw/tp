import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from './usuario.service';

@Injectable({
    providedIn: 'root',
})
export class AdminGuard implements CanActivate {
    constructor(private usuarioService: UsuarioService, private router: Router) { }

    canActivate(): Promise<boolean> {
        return new Promise((resolve) => {
            const token = localStorage.getItem('token');
            if (!token) {
                this.router.navigate(['/inicio']);
                resolve(false);
                return;
            }

            this.usuarioService.getTipo().subscribe({
                next: (response) => {
                    if (response.data && response.data.tipo === 'admin') {
                        resolve(true); // Permite el acceso si el tipo de usuario es 'admin'
                    } else {
                        this.router.navigate(['/inicio']);
                        resolve(false); // Rechaza el acceso si el tipo de usuario no es 'admin'
                    }
                },
                error: () => {
                    this.router.navigate(['/inicio']);
                    resolve(false);
                },
            });
        });
    }
}