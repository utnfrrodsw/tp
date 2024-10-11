import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { BuscaClienteService } from '../service/busca-cliente.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  isEmployee: boolean = false; // Nueva propiedad para verificar si es empleado
  userName: string = '';

  constructor(
    private router: Router,
    private buscaCliente: BuscaClienteService,
    private cdr: ChangeDetectorRef
  ) {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const idCliente = localStorage.getItem('idCliente');
    const token = localStorage.getItem('authToken');
    const employeeToken = localStorage.getItem('empleadoToken'); // Obtener el token de empleado

    this.isLoggedIn = !!token || !!employeeToken; // Verifica si hay un token de cliente o empleado
    this.isEmployee = !!employeeToken; // Verifica si el usuario es un empleado

    if (this.isLoggedIn && idCliente) {
      this.buscaCliente.getClienteById(Number(idCliente)).subscribe({
        next: (cliente) => {
          const apellidoYnombre = cliente.apellidoYnombre;
          const [apellido, nombre] = apellidoYnombre.split(' ');
          this.userName = nombre;

          // Forzar la detección de cambios
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error al obtener el cliente:', err);
        }
      });
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('idCliente');
    localStorage.removeItem('empleadoToken'); // Eliminar el token de empleado al cerrar sesión
    this.isLoggedIn = false;
    this.isEmployee = false; // Reiniciar el estado de isEmployee
    this.router.navigate(['/']);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  onHeaderClick(event: MouseEvent) {
    event.preventDefault();
  }
}
