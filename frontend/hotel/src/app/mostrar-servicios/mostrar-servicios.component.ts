import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../service/servicios.service';
import { EstadiasClienteService } from '../service/estadias-cliente.service'; 
import { ConsumirServicioEstadiaService } from '../service/consumir-servicio-estadia.service';
@Component({
  selector: 'app-mostrar-servicios',
  templateUrl: './mostrar-servicios.component.html',
  styleUrls: ['./mostrar-servicios.component.css']
})
export class MostrarServiciosComponent implements OnInit {

  data: any[] = [];
  isLoggedIn: boolean = false;
  hasActiveStay: boolean = false;

  constructor(
    private serviciosService: ServiciosService,
    private estadiasClienteService: EstadiasClienteService ,
    private consumirServicioEstadiaService: ConsumirServicioEstadiaService
  ) { }

  ngOnInit(): void {
    this.obtenerServicios();
    this.checkLoginStatus();
  }

  obtenerServicios() {
    this.serviciosService.getData().subscribe(data => {
      this.data = data;
    });
  }

  checkLoginStatus() {
    const token = localStorage.getItem('authToken');
    this.isLoggedIn = !!token;

    if (this.isLoggedIn) {
      this.estadiasClienteService.getEstadiasPorCliente().subscribe({
        next: (estadias: any[]) => {  
         
          this.hasActiveStay = estadias.some((estadia: any) => estadia.estado === 'Activo'); 
        },
        error: (err) => {
          console.error('Error al obtener las estadías:', err);
        }
      });
    }
  }

  inscribirme(idServicio: number) {
    console.log('ID Servicio:', idServicio); // Verificar el idServicio recibido

    // Obtener las estadías del cliente
    this.estadiasClienteService.getEstadiasPorCliente().subscribe({
      next: (estadias: any[]) => {
        const activeStay = estadias.find(estadia => estadia.estado === 'Activo');
        
        console.log('Estadías:', estadias); // Verificar las estadías
        console.log('Estadía activa:', activeStay); // Verificar la estadía activa

        if (activeStay) {
          const idEstadia = activeStay.idEst; // Obtener el idEstadia

          // Mostrar los IDs en la consola
          console.log('ID Servicio:', idServicio);
          console.log('ID Estadía:', idEstadia);

          // Llamar al servicio para inscribirse
          this.consumirServicioEstadiaService.inscribirse(idServicio, idEstadia).subscribe({
            next: () => {
              console.log('Inscripción realizada');
            },
            error: (err) => {
              console.error('Error en la inscripción:', err);
            }
          });
        } else {
          console.log('No hay estadías activas disponibles para inscribirse');
        }
      },
      error: (err) => {
        console.error('Error al obtener las estadías:', err);
      }
    });
  }

  cancelarInscripcion(idServicio: number) {
    
    console.log('Cancelando inscripción para ID Servicio:', idServicio);
    
  }


}

