import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { BuscaClienteService } from '../service/busca-cliente.service';
import { EmpleadosService } from '../service/empleados.service'; // Importa el servicio de empleados
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  isEmployee: boolean = false; // Propiedad para verificar si es empleado
  userName: string = '';

  constructor(
    private router: Router,
    private buscaCliente: BuscaClienteService,
    private empleadosService: EmpleadosService, // Inyecta el servicio de empleados
    private cdr: ChangeDetectorRef
  ) {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const idCliente = localStorage.getItem('idCliente');
    const token = localStorage.getItem('authToken');
    const employeeToken = localStorage.getItem('empleadoToken'); 
    const employeeDni = localStorage.getItem('empleadoDni'); // Obtener el DNI del empleado

    this.isLoggedIn = !!token || !!employeeToken; 
    this.isEmployee = !!employeeToken; 

    if (this.isLoggedIn && idCliente && !this.isEmployee) {
      // Si está logueado como cliente, obtener datos del cliente
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
    } else if (this.isEmployee && employeeDni) {
      // Si está logueado como empleado, obtener datos del empleado
      this.empleadosService.getEmpleadoByDni(Number(employeeDni)).subscribe({
        next: (empleado) => {
          const apellidoYnombre = empleado.apellidoYnombre;
          const [apellido, nombre] = apellidoYnombre.split(' ');
          this.userName = nombre;

          // Forzar la detección de cambios
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error al obtener los datos del empleado:', err);
        }
      });
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('idCliente');
    localStorage.removeItem('empleadoToken'); // Eliminar el token de empleado al cerrar sesión
    localStorage.removeItem('empleadoDni'); // Eliminar el DNI del empleado
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
