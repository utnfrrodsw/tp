import { Component } from '@angular/core';
import { LocalidadesService } from '../localidades.service';

@Component({
  selector: 'app-localidades',
  templateUrl: './localidades.component.html',
  styleUrl: './localidades.component.scss'
})
export class LocalidadesComponent {
  constructor (private service: LocalidadesService) {
  }
  
  list:any = [];
  localidad:any = Object;

  ngOnInit(): void{

  }

  loadLocalidades(){
    return this.service.getLocalidades().subscribe(response => this.list = response);
  }

  loadOne(id:string){
    return this.service.getOneLocalidad(id).subscribe(response => this.localidad = response);
  }

  removeLocalidad(id:string){
    return this.service.remove(id).subscribe(response => this.localidad = response);
  }

  addLocalidad(nombre_localidad:string, id:string){
    return this.service.add(nombre_localidad, parseInt(id)).subscribe(response => this.localidad = response);
  }

  putLocalidad(nombre_localidad:string, id:string){
    return this.service.modLocalidad(nombre_localidad, parseInt(id)).subscribe(response => this.localidad = response);
  }
}