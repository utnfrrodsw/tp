import { Component } from '@angular/core';
import { PartidoService } from '../partido.service';

@Component({
  selector: 'app-partido',
  templateUrl: './partido.component.html',
  styleUrl: './partido.component.scss'
})
export class PartidoComponent {
  constructor (private service: PartidoService) {
  }
  
  list:any = [];
  partido:any = Object;

  ngOnInit(): void{

  }

  loadPartidos(){
    return this.service.getPartidos().subscribe(response => this.list = response);
  }

  loadOne(id:string){
    return this.service.getOnePartido(id).subscribe(response => this.partido = response);
  }

  removePartido(id:string){
    return this.service.remove(id).subscribe(response => this.partido = response);
  }

  addPartido(fecha: string, torneo: string, equipo1: string, equipo2: string, id: string){
    return this.service.add(fecha, torneo, equipo1, equipo2, parseInt(id)).subscribe(response => this.partido = response);
  }

  putPartido(fecha: string, torneo: string, equipo1: string, equipo2: string, id: string){
    return this.service.modPartido(fecha, torneo, equipo1, equipo2, parseInt(id)).subscribe(response => this.partido = response);
  }
}