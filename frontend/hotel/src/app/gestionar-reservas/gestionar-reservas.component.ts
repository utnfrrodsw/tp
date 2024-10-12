import { Component, OnInit } from '@angular/core';
import { EstadiasClienteService } from '../service/estadias-cliente.service'; 
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-gestionar-reservas',
  templateUrl: './gestionar-reservas.component.html',
  styleUrls: ['./gestionar-reservas.component.css'],
})
export class GestionarReservasComponent implements OnInit {
  reservasPendientes: any[] = []; 
  reservasActivas: any[] = []; 
  reservasCanceladas: any[] = []; // Agregar array para reservas canceladas
  originalReservasPendientes: any[] = []; 
  originalReservasActivas: any[] = []; 
  originalReservasCanceladas: any[] = []; // Agregar array original para reservas canceladas
  searchId: string = ''; 

  constructor(private estadiasClienteService: EstadiasClienteService) {}

  ngOnInit(): void {
    this.loadReservas();
  }

  loadReservas() {
    this.estadiasClienteService.getAllEstadias().subscribe((data: any[]) => {
        // Filtrar reservas pendientes
        this.reservasPendientes = data.filter(reserva => reserva.estado === 'Reservado');
        if (this.reservasPendientes.length > 1) {
            this.reservasPendientes.sort((a, b) => new Date(a.fechaIngreso).getTime() - new Date(b.fechaIngreso).getTime());
        }

        // Filtrar reservas activas
        this.reservasActivas = data.filter(reserva => reserva.estado === 'Activo'); 
        if (this.reservasActivas.length > 1) {
            this.reservasActivas.sort((a, b) => new Date(a.fechaIngreso).getTime() - new Date(b.fechaIngreso).getTime());
        }

        // Filtrar reservas canceladas
        this.reservasCanceladas = data.filter(reserva => reserva.estado === 'Cancelado'); 
        if (this.reservasCanceladas.length > 1) {
            this.reservasCanceladas.sort((a, b) => new Date(a.fechaIngreso).getTime() - new Date(b.fechaIngreso).getTime());
        }

        // Guardar las reservas originales para realizar busquedas
        this.originalReservasPendientes = [...this.reservasPendientes];
        this.originalReservasActivas = [...this.reservasActivas];
        this.originalReservasCanceladas = [...this.reservasCanceladas]; // Guardar reservas canceladas originales

    }, (error) => {
        console.error('Error al cargar las reservas:', error);
    });
}


  searchReservas() {
    if (this.searchId) {
      const searchIdLower = this.searchId.toLowerCase(); 
      this.reservasPendientes = this.originalReservasPendientes.filter(reserva => 
        reserva.nroDni !== undefined && 
        reserva.nroDni.toString().includes(searchIdLower) 
      );
      
      this.reservasActivas = this.originalReservasActivas.filter(reserva => 
        reserva.nroDni !== undefined && 
        reserva.nroDni.toString().includes(searchIdLower) 
      );

      this.reservasCanceladas = this.originalReservasCanceladas.filter(reserva => 
        reserva.nroDni !== undefined && 
        reserva.nroDni.toString().includes(searchIdLower) 
      );
    } else {
      this.loadReservas(); 
    }
  }

  realizarCheckout(idEstadia: number) {
    console.log('Realizar Check-Out para ID Estadia:', idEstadia);
  }

  reestablecerReserva(idEstadia: number) {
    console.log('Reestablecer Reserva para ID Estadia:', idEstadia);
    
  }
}
