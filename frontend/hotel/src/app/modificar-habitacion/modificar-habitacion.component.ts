import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HabitacionesService } from '../service/habitaciones.service';
import { TiposHabitacionService } from '../service/tiposhabitacion.service';

@Component({
  selector: 'app-modificar-habitacion',
  templateUrl: './modificar-habitacion.component.html',
  styleUrls: ['./modificar-habitacion.component.css']
})
export class ModificarHabitacionComponent implements OnInit {
  habitacion: any;
  tiposHabitaciones: any[] = [];

  constructor(
    private router: Router, 
    private tipo: TiposHabitacionService, 
    private habitacionesService: HabitacionesService  
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state["habitacion"]) {
      this.habitacion = navigation.extras.state["habitacion"];
    } else {
      console.error('No se ha recibido una habitación válida');
    }
  }

  ngOnInit(): void {
    this.cargarTiposHabitacion();
  }

  cargarTiposHabitacion(): void {
    this.tipo.getTiposHabitacion().subscribe({
      next: (data: any) => { // Aquí usamos 'any' para evitar el error
        this.tiposHabitaciones = data;
        if (this.habitacion.tipo) {
          this.habitacion.tipo = this.habitacion.tipo;
        }
      },
      error: (error) => {
        console.error('Error al cargar los tipos de habitación:', error);
      }
    });
  }

  onTipoChange(): void {
    console.log('Tipo de habitación seleccionado:', this.habitacion.tipo);
  }

  actualizarHabitacion(): void {
    if (this.habitacion.nroHabitacion && this.habitacion.tipo && this.habitacion.descripcion && this.habitacion.estado && this.habitacion.capacidadPersonas && this.habitacion.precioXdia) {
      const habitacionActualizada = {
        nroHabitacion: this.habitacion.nroHabitacion, 
        idTipo: this.habitacion.tipo,  
        descripcion: this.habitacion.descripcion,  
        estado: this.habitacion.estado,  
        foto: this.habitacion.foto || '',  
        capacidadPersonas: this.habitacion.capacidadPersonas, 
        precioXdia: this.habitacion.precioXdia 
      };

      this.habitacionesService.updateHabitacion(Number(this.habitacion.nroHabitacion), habitacionActualizada).subscribe({
        next: (response) => {
          console.log('Habitación actualizada con éxito:', response);
          this.router.navigate(['/gestionar-habitaciones']);  
        },
        error: (error) => {
          console.error('Error al actualizar la habitación:', error);
        }
      });
    } else {
      console.error('Faltan datos para actualizar la habitación');
    }
  }

  cancelar(): void {
    this.router.navigate(['/gestionar-habitaciones']);
  }
}
