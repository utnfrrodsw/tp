import { Component } from '@angular/core';
import { EquipoService } from '../equipo.service';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrl: './equipo.component.scss'
})
export class EquipoComponent {
  constructor (private service: EquipoService) {
  }
  
  list:any = [];
  equipo:any = Object;

  ngOnInit(): void{

  }

  loadEquipos(){
    return this.service.getEquipos().subscribe(response => this.list = response);
  }

  loadOne(id:string){
    return this.service.getOneEquipo(id).subscribe(response => this.equipo = response);
  }

  removeEquipo(id:string){
    return this.service.remove(id).subscribe(response => this.equipo = response);
  }

  addEquipo(jugador1: string, jugador2: string, jugador3: string, jugador4: string, jugador5: string, torneo: string, id: string){
    return this.service.add(jugador1, jugador2, jugador3, jugador4, jugador5, torneo, parseInt(id)).subscribe(response => this.equipo = response);
  }

  putEquipo(jugador1: string, jugador2: string, jugador3: string, jugador4: string, jugador5: string, torneo: string, id: string){
    return this.service.modEquipo(jugador1, jugador2, jugador3, jugador4, jugador5, torneo, parseInt(id)).subscribe(response => this.equipo = response);
  }
}