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

  ngOnInit(): void{

  }

  loadTipo_Participante(){
    return this.service.getTipo_Participante().subscribe(response => this.list = response);
  }
}