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

  ngOnInit(): void{

  }

  loadFormatos(){
    return this.service.getFormatos().subscribe(response => this.list = response);
  }
}
