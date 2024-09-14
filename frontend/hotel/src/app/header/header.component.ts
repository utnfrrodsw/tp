import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BuscaClienteService } from '../service/busca-cliente.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  userName: string = '';

  constructor(private router: Router,
              private buscaCliente: BuscaClienteService
  ) {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const idCliente = localStorage.getItem('idCliente');
    const token = localStorage.getItem('authToken');
    this.isLoggedIn = !!token;
    if (this.isLoggedIn && idCliente) {
      
      this.buscaCliente.getClienteById(Number(idCliente)).subscribe({
        next: (cliente) => {
          const apellidoYnombre = cliente.apellidoYnombre;
          const [apellido, nombre] = apellidoYnombre.split(' '); 
          this.userName = nombre; 
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
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
}
