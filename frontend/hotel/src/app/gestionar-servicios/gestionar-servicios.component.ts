import { Component, OnInit } from '@angular/core';
import { ServiciosClientesService } from '../service/servicios-clientes.service'; 

@Component({
  selector: 'app-gestionar-servicios',
  templateUrl: './gestionar-servicios.component.html',
  styleUrls: ['./gestionar-servicios.component.css']
})
export class GestionarServiciosComponent implements OnInit {
  loading: boolean = true;
  error: string = '';
  servicios: any[] = []; 

  constructor(private serviciosClientesService: ServiciosClientesService) { }

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.serviciosClientesService.obtenerServicios().subscribe({
      next: (data) => {
        
        this.servicios = data.map((item: any) => ({
          idServicio: item.idServicio,
          idEstadia: item.idEstadia
        }));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los servicios';
        console.error(err);
        this.loading = false;
      }
    });
  }

  cancelarServicio(idEstadia: number) {
    
    console.log(`Cancelando servicio con idEstadia: ${idEstadia}`);
  }

  modificarServicio(idEstadia: number) {
    
    console.log(`Modificando servicio con idEstadia: ${idEstadia}`);
  }
}
