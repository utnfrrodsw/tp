import {  Component, OnInit } from '@angular/core';
import { HabitacionesService } from '../service/habitaciones.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mostrar-habitaciones',
  templateUrl: './mostrar-habitaciones.component.html',
  styleUrl: './mostrar-habitaciones.component.css'
})
export class MostrarHabitacionesComponent implements OnInit {

constructor(private habitacionesService: HabitacionesService,
  private router: Router,
  private route: ActivatedRoute){}

ngOnInit(): void {
  this.route.paramMap.subscribe(() => {
    this.obtenerHabitaciones();
  });
}

data: any[] = [];

obtenerHabitaciones(){

this.habitacionesService.getData().subscribe(data => {

  this.data = data;

  
});

}
refreshComponent() {
  this.router.navigateByUrl('/habitaciones', { skipLocationChange: true }).then(() => {
    this.router.navigate(['/habitaciones']);
  });
}

}
