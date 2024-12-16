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

  data: any[] = [];  // Servicios disponibles
  isLoggedIn: boolean = false;  // Verificación si el usuario está logueado
  hasActiveStay: boolean = false;  // Verificación si el usuario tiene una estadía activa

  constructor(
    private serviciosService: ServiciosService,
    private estadiasClienteService: EstadiasClienteService,
    private consumirServicioEstadiaService: ConsumirServicioEstadiaService
  ) { }

  ngOnInit(): void {
    this.checkLoginStatus();
    this.obtenerServicios();
  }

  // Verifica si el usuario está logueado y tiene una estadía activa
  checkLoginStatus() {
    const token = localStorage.getItem('authToken');
    this.isLoggedIn = !!token;  // Comprueba si existe un token

    if (this.isLoggedIn) {
      this.estadiasClienteService.getEstadiasPorCliente().subscribe({
        next: (estadias: any[]) => {
          this.hasActiveStay = estadias.some((estadia: any) => estadia.estado === 'Activo'); // Verifica si hay alguna estadía activa
        },
        error: (err) => {
          console.error('Error al obtener las estadías:', err);
        }
      });
    }
  }

  // Obtiene los servicios disponibles y marca si el cliente está inscrito en ellos
  obtenerServicios() {
    this.serviciosService.getData().subscribe({
      next: (data) => {
        this.data = data;

        if (this.isLoggedIn && this.hasActiveStay) {
          this.estadiasClienteService.getEstadiasPorCliente().subscribe({
            next: (estadias: any[]) => {
              const activeStay = estadias.find(estadia => estadia.estado === 'Activo');
              
              if (activeStay) {
                const idEstadia = activeStay.idEst;

                // Obtener servicios inscritos para la estadía activa
                this.consumirServicioEstadiaService.getServiciosInscriptos(idEstadia).subscribe({
                  next: (serviciosInscriptos: number[]) => {
                    // Marcar los servicios como inscritos
                    this.data.forEach(servicio => {
                      servicio.inscripto = serviciosInscriptos.includes(servicio.idServ);
                    });
                  },
                  error: (err) => {
                    console.error('Error al obtener los servicios inscritos:', err);
                  }
                });
              }
            },
            error: (err) => {
              console.error('Error al obtener las estadías:', err);
            }
          });
        }
      },
      error: (err) => {
        console.error('Error al obtener los servicios:', err);
      }
    });
  }

  // Inscribirse en un servicio
  inscribirme(idServicio: number) {
    this.estadiasClienteService.getEstadiasPorCliente().subscribe({
      next: (estadias: any[]) => {
        const activeStay = estadias.find(estadia => estadia.estado === 'Activo');
        
        if (activeStay) {
          const idEstadia = activeStay.idEst;

          this.consumirServicioEstadiaService.inscribirse(idServicio, idEstadia).subscribe({
            next: () => {
              console.log('Inscripción realizada');

              // Actualizar el estado del servicio inscrito en el array data
              const servicioInscrito = this.data.find(servicio => servicio.idServ === idServicio);
              if (servicioInscrito) {
                servicioInscrito.inscripto = true; // Actualizamos la propiedad inscripto para que el botón cambie
              }
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

  // Cancelar inscripción de un servicio
  cancelarInscripcion(idServicio: number) {
    console.log('Cancelando inscripción para ID Servicio:', idServicio);
    // Aquí iría la lógica para cancelar la inscripción
  }
}
