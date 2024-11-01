import { Component, OnInit } from '@angular/core';
import { BuscaClienteService } from '../service/busca-cliente.service';

@Component({
  selector: 'app-gestionar-clientes',
  templateUrl: './gestionar-clientes.component.html',
  styleUrl: './gestionar-clientes.component.css'
})
export class GestionarClientesComponent implements OnInit{
  clientes: any[] = [];
  searchId: string = ''; 
 clientesFiltrados: any[] = []; 
  

  constructor(private buscaClientes: BuscaClienteService) { }

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.buscaClientes.obtenerClientes().subscribe(
      (data: any[]) => {
        this.clientes = data.map(cliente => {
          cliente.fechaNac = this.formatearFecha(cliente.fechaNac);
          return cliente;
        });
        this.clientesFiltrados = this.clientes; 
      },
      (error) => {
        console.error('Error al cargar los clientes');
      }
    );
  }

  searchClientes() {
    if (this.searchId) {
      const searchIdLower = this.searchId.toLowerCase(); 
      this.clientesFiltrados = this.clientes.filter(cliente => 
        cliente.nroDni !== undefined && 
        cliente.nroDni.toString().includes(searchIdLower) 
      );
    } else {
      this.clientesFiltrados = this.clientes; 
    }
  }


  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

}
