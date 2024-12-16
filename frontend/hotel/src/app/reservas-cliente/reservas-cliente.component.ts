import { Component, OnInit } from '@angular/core';
import { EstadiasClienteService } from '../service/estadias-cliente.service';

@Component({
  selector: 'app-reservas-cliente',
  templateUrl: './reservas-cliente.component.html',
  styleUrls: ['./reservas-cliente.component.css'] 
})
export class ReservasClienteComponent implements OnInit {
  estadias: any[] = [];

  constructor(private estadiasClienteService: EstadiasClienteService) {}

  ngOnInit(): void {
    this.estadiasClienteService.getEstadiasPorCliente().subscribe(
      data => {
        
        this.estadias = data;
      },
      error => {
        console.error('Error al obtener las estadías', error);
      }
    );
  }

  // Método para cancelar la reserva
  cancelarReserva(idEst: number): void {
    this.estadiasClienteService.cancelarReserva(idEst).subscribe(
      response => {
        console.log('Reserva cancelada:', response);
        // Actualiza la lista de estadías después de cancelar
        this.estadias = this.estadias.map(estadia => 
          estadia.idEst === idEst ? { ...estadia, estado: 'Cancelado' } : estadia
        );
      },
      error => {
        console.error('Error al cancelar la reserva', error);
      }
    );
  }
}
