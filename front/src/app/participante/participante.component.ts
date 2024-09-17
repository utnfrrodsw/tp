import { Component } from '@angular/core';
import { ParticipanteService } from '../participante.service';

@Component({
  selector: 'app-participante',
  templateUrl: './participante.component.html',
  styleUrl: './participante.component.scss'
})
export class ParticipanteComponent {
  constructor (private service: ParticipanteService) {
  }
  
  list:any = [];
  participante:any = Object;

  ngOnInit(): void{

  }

  loadParticipantes(){
    return this.service.getParticipantes().subscribe(response => this.list = response);
  }

  loadOne(id:string){
    return this.service.getOneParticipante(id).subscribe(response => this.participante = response);
  }

  removeParticipante(id:string){
    return this.service.remove(id).subscribe(response => this.participante = response);
  }

  addParticipante(nombre:string, contraseña:string, apellido:string, mail:string, fecha_nacimiento:string, tipo_par: string, id: string){
    return this.service.add(nombre, contraseña, apellido, mail, fecha_nacimiento, tipo_par, parseInt(id)).subscribe(response => this.participante = response);
  }

  putParticipante(nombre:string, contraseña:string, apellido:string, mail:string, fecha_nacimiento:string, tipo_par: string, id: string){
    return this.service.modParticipante(nombre, contraseña, apellido, mail, fecha_nacimiento, tipo_par, parseInt(id)).subscribe(response => this.participante = response);
  }
}