import { Component, OnInit } from '@angular/core';
import { EstadiasClienteService } from '../service/estadias-cliente.service'; 
import { AlertaCheckinComponent } from '../alerta-checkin/alerta-checkin.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-gestionar-reservas',
  templateUrl: './gestionar-reservas.component.html',
  styleUrls: ['./gestionar-reservas.component.css'],
})
export class GestionarReservasComponent implements OnInit {
  reservasPendientes: any[] = []; 
  reservasActivas: any[] = []; 
  reservasCanceladas: any[] = []; 
  reservasFinalizadas: any[] = []; 
  originalReservasPendientes: any[] = []; 
  originalReservasActivas: any[] = []; 
  originalReservasCanceladas: any[] = []; 
  originalReservasFinalizadas: any[] = []; 
  searchId: string = ''; 

  constructor(private estadiasClienteService: EstadiasClienteService,private dialog: MatDialog) {}

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

        // Filtrar reservas finalizadas
        this.reservasFinalizadas = data.filter(reserva => reserva.estado === 'Finalizado'); 
        if (this.reservasFinalizadas.length > 1) {
            this.reservasFinalizadas.sort((a, b) => new Date(a.fechaIngreso).getTime() - new Date(b.fechaIngreso).getTime());
        }

        // Guardar las reservas originales para realizar búsquedas
        this.originalReservasPendientes = [...this.reservasPendientes];
        this.originalReservasActivas = [...this.reservasActivas];
        this.originalReservasCanceladas = [...this.reservasCanceladas]; 
        this.originalReservasFinalizadas = [...this.reservasFinalizadas]; 

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

      this.reservasFinalizadas = this.originalReservasFinalizadas.filter(reserva => 
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

  realizarCheckin(idEstadia: number, reserva: any): void {
    const fechaIngresoFormateada = this.formatearFecha(reserva.fechaIngreso);
    const fechaEgresoFormateada = this.formatearFecha(reserva.fechaEgreso);
    
    const mensaje = `¿Estás seguro que deseas realizar el check-in para ${reserva.apellidoYnombre}? <br><br>
    La habitación del huésped es: ${reserva.nroHabitacion} <br><br>
    Ingresa el día: ${fechaIngresoFormateada} y se retira el día: ${fechaEgresoFormateada}.`;

    const dialogRef = this.dialog.open(AlertaCheckinComponent, {
        width: '400px',
        data: { mensaje }
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            this.realizarCheckinEstadia(idEstadia);
        }
    });
}


  private formatearFecha(fecha: string): string {
    const fechaObj = new Date(fecha);
    const dia = String(fechaObj.getDate()).padStart(2, '0');
    const mes = String(fechaObj.getMonth() + 1).padStart(2, '0'); 
    const anio = fechaObj.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }

  realizarCheckinEstadia(idEstadia: number) {
    this.estadiasClienteService.checkinEstadia(idEstadia).subscribe(
      response => {
        console.log('Check-in realizado exitosamente:', response);
        this.loadReservas(); 
      },
      error => {
        console.error('Error al realizar check-in:', error);
      }
    );
  }


  reestablecerReserva(idEstadia: number) {
    console.log('Reestablecer Reserva para ID Estadia:', idEstadia);
  }
}
