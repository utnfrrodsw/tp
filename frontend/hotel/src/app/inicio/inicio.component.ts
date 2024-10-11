import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../service/search.service';
import { EmpleadosService } from '../service/empleados.service'; // Asegúrate de importar el servicio

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
    private searchService: SearchService,
    private empleadosService: EmpleadosService // Inyectar el servicio aquí
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

    this.searchService.getLocalidadByName(destination).subscribe((localidad: any) => {
      const idLocalidad = localidad.idLocalidad;

      if (!idLocalidad) {
        alert('Localidad no encontrada');
        return;
      }

      // Navegar al componente mostrar habitaciones con los datos necesarios
      this.router.navigate(['/habitaciones/disponibles'], {
        queryParams: {
          checkin: checkinFormatted,
          checkout: checkoutFormatted,
          people: people,
          idLocalidad: idLocalidad
        }
      });
    }, error => {
      alert('Error al obtener la localidad');
      console.error('Error en la solicitud de localidad:', error);
    });
  }

  isEmpleadoLoggedIn(): boolean {
    return this.empleadosService.getTokenFromLocalStorage() !== null; // Verificar si el token existe
  }
}
