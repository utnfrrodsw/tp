import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { BuscaClienteService } from '../service/busca-cliente.service';
import { EmpleadosService } from '../service/empleados.service'; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  isEmployee: boolean = false; 
  userName: string = '';

  constructor(
    private router: Router,
    private buscaCliente: BuscaClienteService,
    private empleadosService: EmpleadosService, 
  ) {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const idCliente = localStorage.getItem('idCliente');
    const token = localStorage.getItem('authToken');
    const employeeToken = localStorage.getItem('empleadoToken'); 
    const employeeDni = localStorage.getItem('empleadoDni'); 
    const employeeNombre = localStorage.getItem('empleadoNombre'); 
    const clienteNombre = localStorage.getItem('nombreCliente'); 

    this.isLoggedIn = !!token || !!employeeToken; 
    this.isEmployee = !!employeeToken;

    if (this.isLoggedIn && idCliente && !this.isEmployee) {
      if (clienteNombre) {
        const [apellido, nombre] = clienteNombre.split(' ');
        this.userName = nombre;
      } else {
        console.error('El nombre del cliente no está disponible en localStorage.');
      }
    } else if (this.isEmployee && employeeDni) {
      if (employeeNombre) {
        const [apellido, nombre] = employeeNombre.split(' ');
        this.userName = nombre;
      } else {
        console.error('El nombre del empleado no está disponible en localStorage.');
      }
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('idCliente');
    localStorage.removeItem('empleadoToken'); 
    localStorage.removeItem('empleadoDni'); 
    localStorage.removeItem('empleadoNombre');
    localStorage.removeItem('nombreCliente'); 
    this.isLoggedIn = false;
    this.isEmployee = false; 
    this.userName = ''; 
    this.router.navigate(['/']);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  onHeaderClick(event: MouseEvent) {
    event.preventDefault();
  }
}
