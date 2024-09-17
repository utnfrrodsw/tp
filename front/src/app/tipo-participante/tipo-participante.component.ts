import { Component } from '@angular/core';
import { TipoParticipanteService } from '../tipo-participante.service';

@Component({
  selector: 'app-tipo-participante',
  templateUrl: './tipo-participante.component.html',
  styleUrl: './tipo-participante.component.scss'
})
export class TipoParticipanteComponent {
  constructor (private service: TipoParticipanteService) {
  }
  
  list:any = [];
  tipo_par:any = Object;

  ngOnInit(): void{

  }

  loadTipo_Participante(){
    return this.service.getTipo_Participante().subscribe(response => this.list = response);
  }

  loadOne(id:string){
    return this.service.getOneTipo(id).subscribe(response => this.tipo_par = response);
  }

  removeLocalidad(id:string){
    return this.service.remove(id).subscribe(response => this.tipo_par = response);
  }

  addLocalidad(posicion:string, id:string){
    return this.service.add(posicion, parseInt(id)).subscribe(response => this.tipo_par = response);
  }

  putLocalidad(posicion:string, id:string){
    return this.service.modTipo(posicion, parseInt(id)).subscribe(response => this.tipo_par = response);
  }
}