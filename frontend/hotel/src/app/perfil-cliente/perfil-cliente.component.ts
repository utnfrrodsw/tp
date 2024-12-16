import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BuscaClienteService } from '../service/busca-cliente.service';
import { AlertaComponent } from '../alerta/alerta.component'; // Importa el componente de alerta

@Component({
  selector: 'app-perfil-cliente',
  templateUrl: './perfil-cliente.component.html',
  styleUrls: ['./perfil-cliente.component.css']
})
export class PerfilClienteComponent implements OnInit {

  cliente: any;
  errorMessage: string = '';

  constructor(
    private clienteService: BuscaClienteService,
    private router: Router,
    private dialog: MatDialog 
  ) {}

  ngOnInit(): void {
    const idCliente = localStorage.getItem('idCliente');
    if (idCliente) {
      this.clienteService.getClienteById(Number(idCliente)).subscribe({
        next: (data) => {
          this.cliente = data;
          console.log('Cliente cargado:', this.cliente);
        },
        error: (err) => {
          this.errorMessage = 'Error al cargar el perfil del cliente.';
          console.error('Error en la carga del cliente:', err);
        }
      });
    } else {
      this.errorMessage = 'No se encontró el ID del cliente.';
    }
  }

  eliminarCuenta(): void {
    const dialogRef = this.dialog.open(AlertaComponent, {
      width: '350px',
      data: { mensaje: '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const idCliente = localStorage.getItem('idCliente');
        
        this.clienteService.eliminarCliente(Number(idCliente)).subscribe({
          next: (response) => {
            
            localStorage.removeItem('idCliente');
            localStorage.removeItem('token');
            this.router.navigate(['']);
          },
          error: (err) => {
            const idCliente = localStorage.getItem('idCliente');
            console.log(idCliente);
            this.errorMessage = 'Error al intentar eliminar la cuenta.';
          }
        });
      }
    });
  }
}
