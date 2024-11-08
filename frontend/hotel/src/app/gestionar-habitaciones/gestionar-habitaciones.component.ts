import { Component, OnInit } from '@angular/core';
import { HabitacionesService } from '../service/habitaciones.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarEliminacionComponent } from '../confirmar-eliminacion/confirmar-eliminacion.component';
import { AlertadosComponent } from '../alertados/alertados.component';

@Component({
  selector: 'app-gestionar-habitaciones',
  templateUrl: './gestionar-habitaciones.component.html',
  styleUrls: ['./gestionar-habitaciones.component.css']
})
export class GestionarHabitacionesComponent implements OnInit {
  habit: any[] = [];
  habitFiltradas: any[] = []; 
  searchId: string = '';
  mensajeExito: string = '';

  constructor(
    private habitaciones: HabitacionesService, 
    private router: Router,
    private dialog: MatDialog  // Inyectamos MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarHabitaciones();
  }

  cargarHabitaciones(): void {
    this.habitaciones.getData().subscribe({
      next: (data: any[]) => {
        this.habit = data;
        this.habitFiltradas = this.habit;
      },
      error: (error) => {
        console.error('Error al cargar las habitaciones', error);
      }
    });
  }

  filtrarHabitaciones() {
    if (this.searchId) {
      this.habitFiltradas = this.habit.filter(habitacion => 
        habitacion.nroHabitacion.toString().includes(this.searchId)
      );
    } else {
      this.habitFiltradas = this.habit;
    }
  }

  modificarHabitacion(habitacion: any) {
    console.log("Habitación seleccionada: ", habitacion);
    this.router.navigate(['/modificar-habitacion'], { state: { habitacion: habitacion } });
  }

  nuevaHabitacion() {
    this.router.navigate(['/nueva-habitacion']);
  }

  // Método para eliminar habitación usando MatDialog
  eliminarHabitacion(id: number): void {
    const dialogRef = this.dialog.open(ConfirmarEliminacionComponent, {
      data: { idHabitacion: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si el usuario confirma, eliminar la habitación
        this.habitaciones.deleteHabitacion(id).subscribe({
          next: (response) => {
            this.mensajeExito = 'La habitación fue eliminada correctamente.';
            this.cargarHabitaciones();

            // Abrir el diálogo con la alerta de éxito
            this.dialog.open(AlertadosComponent, {
              width: '300px',
              data: { mensaje: this.mensajeExito }  
            });
          },
          error: (error) => {
            console.error('Error al eliminar la habitación', error);

            this.mensajeExito = 'La habitación no se puede eliminar porque esta relacionada con estadias.';
            this.dialog.open(AlertadosComponent, {
              width: '300px',
              data: { mensaje: this.mensajeExito }  
            });
          }
        });
      }
    });
  }
}
