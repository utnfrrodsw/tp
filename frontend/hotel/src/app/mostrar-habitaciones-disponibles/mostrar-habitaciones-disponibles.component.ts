import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CrearReservaService } from '../service/crear-reserva.service';
import { TiposHabitacionService } from '../service/tiposhabitacion.service';
import { HabitacionesDisponiblesService } from '../service/habitacionesdisponibles.service'; 
import { LocalidadesService } from '../service/localidades.service';
import { ProvinciasService } from '../service/provincias.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';

@Component({
  selector: 'app-mostrar-habitaciones-disponibles',
  templateUrl: './mostrar-habitaciones-disponibles.component.html',
  styleUrls: ['./mostrar-habitaciones-disponibles.component.css']
})
export class MostrarHabitacionesDisponiblesComponent implements OnInit {
  habitaciones: any[] = [];
  tiposHabitacion: any[] = [];
  errorMessage: string = '';
  checkin: string = '';
  checkout: string = '';
  people: string = '';
  idLocalidad: number = 0;
  idProvincia: number = 0;  
  localidad: any = null;  
  provincia: any = null; 
  authToken: string | null = localStorage.getItem('authToken'); 
  idCliente: string | null = localStorage.getItem('idCliente');
  precioMin: number = 0;
  precioMax: number = 0;

  constructor(
    private route: ActivatedRoute,
    private reservaService: CrearReservaService,
    private tiposHabitacionService: TiposHabitacionService,
    private habitacionesService: HabitacionesDisponiblesService,
    private localidadesService: LocalidadesService,
    private provinciasService: ProvinciasService,
    private router: Router,
    private dialog: MatDialog 
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.checkin = params['checkin'];
      this.checkout = params['checkout'];
      this.people = params['people'];
      this.idLocalidad = Number(params['idLocalidad']); 
      this.idProvincia = Number(params['idProvincia']);

      if (this.checkin && this.checkout && this.people && this.idLocalidad && this.idProvincia) {
        this.obtenerHabitacionesDisponibles(); 
        this.obtenerLocalidadYProvincia();
      } else {
        this.errorMessage = 'Datos de búsqueda incompletos';
      }

      this.cargarTiposHabitacion();
    });
  }

  obtenerHabitacionesDisponibles(): void {
    this.habitacionesService.getHabitacionesDisponibles(this.checkin, this.checkout, this.people, this.idLocalidad)
      .subscribe((habitaciones: any[]) => {
        this.habitaciones = habitaciones;
        console.log('Habitaciones disponibles:', this.habitaciones);
      }, error => {
        this.errorMessage = 'Error al obtener las habitaciones disponibles';
        console.error('Error en la solicitud de habitaciones:', error);
      });
  }

  cargarTiposHabitacion(): void {
    this.tiposHabitacionService.getTiposHabitacion().subscribe({
      next: (tipos: any[]) => {
        this.tiposHabitacion = tipos;
      },
      error: (err) => {
        console.error('Error al obtener tipos de habitación:', err);
      }
    });
  }

  getTipoNombre(idTipo: number): string {
    const tipo = this.tiposHabitacion.find(t => t.id === idTipo);
    return tipo ? tipo.denominacion : 'Desconocido';
  }

  reservarHabitacion(nroHabitacion: number): void {
    if (!this.authToken) {
      alert('No estás autenticado. Por favor, inicia sesión.');
      this.router.navigate(['/login']); 
      return;
    }

    if (!this.checkin || !this.checkout || !this.idLocalidad || !nroHabitacion) {
      alert('Datos incompletos para la reserva.');
      return;
    }

    const reservaData = {
      nroHabitacion: nroHabitacion,
      fechaIngreso: this.checkin,
      fechaEgreso: this.checkout,
      idLocalidad: this.idLocalidad,
      idCli: this.idCliente 
    };

    this.reservaService.reservarHabitacion(reservaData).subscribe({
      next: (response) => {
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          data: { message: 'Su reserva fue registrada con éxito.' }
        });

        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/misreservas']);
        });
      },
      error: (err) => {
        alert('Error al realizar la reserva. Intenta nuevamente.');
        console.error('Error en la reserva:', err);
      }
    });
  }

  obtenerLocalidadYProvincia(): void {
    
    this.localidadesService.getLocalidadById(this.idLocalidad).subscribe({
      next: (localidad) => {
        this.localidad = localidad;  
        console.log('Localidad obtenida:', this.localidad);

        
        this.provinciasService.getProvinciaById(this.idProvincia).subscribe({
          next: (provincia) => {
            this.provincia = provincia;  
            console.log('Provincia obtenida:', this.provincia);
          },
          error: (err) => {
            console.error('Error al obtener la provincia:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener la localidad:', err);
      }
    });
  }

  aplicarFiltro(): void {
    let habitacionesFiltradas = this.habitaciones;
  
    console.log('Precio Mínimo:', this.precioMin);
    console.log('Precio Máximo:', this.precioMax);
    console.log('Habitaciones iniciales:', this.habitaciones);
  
    if (this.precioMin) {
      habitacionesFiltradas = habitacionesFiltradas.filter(habitacion => {
        console.log('Precio habitación:', habitacion.precioXdia);
        return habitacion.precioXdia >= this.precioMin;
      });
    }
  
    if (this.precioMax) {
      habitacionesFiltradas = habitacionesFiltradas.filter(habitacion => {
        console.log('Precio habitación:', habitacion.precioXdia);
        return habitacion.precioXdia <= this.precioMax;
      });
    }
  
    this.habitaciones = habitacionesFiltradas;
  
    if (this.habitaciones.length === 0) {
      this.errorMessage = 'No se encontraron habitaciones que coincidan con los criterios de precio.';
    } else {
      this.errorMessage = '';
    }
  
    console.log('Habitaciones filtradas:', this.habitaciones);
  }

  
  borrarFiltros(): void {
    this.precioMin = 0;
    this.precioMax = 0;
    this.obtenerHabitacionesDisponibles();  }
  

}
