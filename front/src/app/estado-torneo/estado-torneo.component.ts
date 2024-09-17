import { Component, Input, OnInit } from '@angular/core';
import { EstadoTorneoService } from '../estado-torneo.service';


@Component({
  selector: 'app-estado-torneo',
  templateUrl: './estado-torneo.component.html',
  styleUrl: './estado-torneo.component.scss'
})
export class EstadoTorneoComponent {
  constructor (private service: EstadoTorneoService) {
  }
  
  list:any = [];
  estado:any = Object;

  ngOnInit(): void{

  }

  loadEstados(){
    return this.service.getEstados().subscribe(response => this.list = response);
  }

  loadOne(id:string){
    return this.service.getOneEstados(id).subscribe(response => this.estado = response);
  }

  removeEstado(id:string){
    return this.service.remove(id).subscribe(response => this.estado = response);
  }

  addEstado(nombre_estado:string, id:string){
    return this.service.add(nombre_estado, parseInt(id)).subscribe(response => this.estado = response);
  }

  putEstado(nombre_estado:string, id:string){
    return this.service.modEstado(nombre_estado, parseInt(id)).subscribe(response => this.estado = response);
  }
}