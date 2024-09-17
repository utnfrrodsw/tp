import { Component } from '@angular/core';
import { FormatosTorneoService } from '../formatos-torneo.service';

@Component({
  selector: 'app-formatos-torneo',
  templateUrl: './formatos-torneo.component.html',
  styleUrl: './formatos-torneo.component.scss'
})
export class FormatosTorneoComponent {
  constructor (private service: FormatosTorneoService) {
  }
  
  list:any = [];
  formato:any = Object;

  ngOnInit(): void{

  }

  loadFormatos(){
    return this.service.getFormatos().subscribe(response => this.list = response);
  }

  loadOne(id:string){
    return this.service.getOneFormato(id).subscribe(response => this.formato = response);
  }

  removeFormato(id:string){
    return this.service.remove(id).subscribe(response => this.formato = response);
  }

  addFormato(cant_grupos:number, cant_equipos_x_grupo:number, cant_clasificados_x_grupo:number, id:string){
    return this.service.add(cant_grupos, cant_equipos_x_grupo, cant_clasificados_x_grupo, parseInt(id)).subscribe(response => this.formato = response);
  }

  putFormato(cant_grupos:number, cant_equipos_x_grupo:number, cant_clasificados_x_grupo:number, id:string){
    return this.service.modFormato(cant_grupos, cant_equipos_x_grupo, cant_clasificados_x_grupo, parseInt(id)).subscribe(response => this.formato = response);
  }
}