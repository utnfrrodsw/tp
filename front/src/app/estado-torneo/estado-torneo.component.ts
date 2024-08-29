import { Component, Input, OnInit } from '@angular/core';
import { response } from 'express';
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
  @Input() id = '';

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
}
