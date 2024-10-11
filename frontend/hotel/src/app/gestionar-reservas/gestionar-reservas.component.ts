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
  searchId: string = ''; 

  constructor(private estadiasClienteService: EstadiasClienteService) {}

  ngOnInit(): void {
    this.loadReservas();
  }

  loadReservas() {
    this.estadiasClienteService.getAllEstadias().subscribe((data: any[]) => {
      this.reservasPendientes = data.filter(reserva => reserva.estado === 'Reservado');
    }, (error) => {
      console.error('Error al cargar las reservas:', error);
    });
  }

  searchReservas() {
    if (this.searchId) {
        this.reservasPendientes = this.reservasPendientes.filter(reserva => 
            reserva.idEst !== undefined && 
            reserva.idEst.toString() === this.searchId
        );
    } else {
        this.loadReservas(); 
    }
}

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}
