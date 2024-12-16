import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalidadesService } from '../service/localidades.service'; 
import { EmpleadosService } from '../service/empleados.service'; 

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  errorMessage: string = '';
  minCheckoutDate: string | null = null;

  constructor(
    private router: Router,
    private localidadesService: LocalidadesService, 
    private empleadosService: EmpleadosService
  ) {}

  updateCheckoutMinDate(event: any) {
    const checkinDate = event.target.value;
    
    if (checkinDate) {
      this.minCheckoutDate = checkinDate;
    }
  }

  buscarHabitaciones() {
    const destination = (document.getElementById('destination') as HTMLInputElement).value;
    const checkin = (document.getElementById('checkin') as HTMLInputElement).value;
    const checkout = (document.getElementById('checkout') as HTMLInputElement).value;
    const people = (document.getElementById('people') as HTMLInputElement).value;

    if (!destination || !checkin || !checkout || !people) {
      alert('Debe completar todos los campos');
      return;
    }

    const convertDateToDDMMYYYY = (dateString: string) => {
      const [year, month, day] = dateString.split('-');
      return `${day}-${month}-${year}`;
    };

    const checkinFormatted = convertDateToDDMMYYYY(checkin);
    const checkoutFormatted = convertDateToDDMMYYYY(checkout);

    
    const [nombreLocalidad, nombreProvincia] = destination.split(',').map(part => part.trim());

    if (!nombreLocalidad || !nombreProvincia) {
      alert('Formato de destino incorrecto. Debe ser "Localidad, Provincia".');
      return;
    }

    // Llamar al servicio para obtener la localidad y la provincia
    this.localidadesService.getLocalidadByNameAndProvincia(nombreLocalidad, nombreProvincia).subscribe((response: any) => {
      const localidad = response.localidad;
      const provincia = response.provincia;

      if (!localidad || !localidad.idLocalidad) {
        alert('Localidad no encontrada');
        return;
      }

      const idLocalidad = localidad.idLocalidad;
      const idProvincia = provincia ? Number(provincia.idProvincia) : null;

      // Navegar a la página de habitaciones disponibles
      this.router.navigate(['/habitaciones/disponibles'], {
        queryParams: {
          checkin: checkinFormatted,
          checkout: checkoutFormatted,
          people: people,
          idLocalidad: idLocalidad,
          idProvincia: idProvincia
        }
      });
    }, error => {
      alert('Error al obtener la localidad');
      console.error('Error en la solicitud de localidad:', error);
    });
  }

  isEmpleadoLoggedIn(): boolean {
    return this.empleadosService.getTokenFromLocalStorage() !== null;
  }
}
