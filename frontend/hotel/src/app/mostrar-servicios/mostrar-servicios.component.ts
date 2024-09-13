import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../service/servicios.service';

@Component({
  selector: 'app-mostrar-servicios',
  templateUrl: './mostrar-servicios.component.html',
  styleUrl: './mostrar-servicios.component.css'
})
export class MostrarServiciosComponent  implements OnInit {

  constructor(private serviciosService: ServiciosService) { }

  data: any[] = [];

  ngOnInit(): void {
    this.obtenerServiios();
    
  }

  obtenerServiios(){

    this.serviciosService.getData().subscribe(data => {
    
      this.data = data;
        
      
    });


  
}

}
