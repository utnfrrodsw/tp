import { Component, OnInit } from '@angular/core';
import { HabitacionesService } from '../service/habitaciones.service';
import { Router } from '@angular/router';
import { TiposHabitacionService } from '../service/tiposhabitacion.service';  

@Component({
  selector: 'app-nueva-habitacion',
  templateUrl: './nueva-habitacion.component.html',
  styleUrls: ['./nueva-habitacion.component.css']
})
export class NuevaHabitacionComponent implements OnInit {
  habitacion = {
    nroHabitacion: 1,
    idTipo: 1,  
    descripcion: '',
    estado: 'Disponible',
    capacidadPersonas: 1,
    precioXdia: 0,
    foto: ''
  };

  tiposHabitaciones: any[] = [];  

  constructor(
    private habitacionesService: HabitacionesService,
    private router: Router,
    private tiposHabitacionService: TiposHabitacionService  
  ) {}

  ngOnInit(): void {
    this.obtenerTiposHabitacion(); 
  }

  obtenerTiposHabitacion(): void {
    this.tiposHabitacionService.getTiposHabitacion().subscribe({
      next: (data) => {
        this.tiposHabitaciones = data;  
      },
      error: (error) => {
        console.error('Error al obtener los tipos de habitación:', error);
      }
    });
  }

  crearHabitacion(): void {
    
    if (this.habitacion.nroHabitacion &&  this.habitacion.idTipo && this.habitacion.descripcion && this.habitacion.capacidadPersonas && this.habitacion.precioXdia) {
      this.habitacionesService.createHabitacion(this.habitacion).subscribe({
        next: (response) => {
          console.log('Habitación creada con éxito:', response);
          this.router.navigate(['/gestionar-habitaciones']); 
        },
        error: (error) => {
          console.error('Error al crear la habitación:', error);
        }
      });
    } else {
      console.error('Faltan datos para crear la habitación : ' + JSON.stringify(this.habitacion));
    }
  }

  cancelar(): void {
    this.router.navigate(['/gestionar-habitaciones']); 
  }
}
