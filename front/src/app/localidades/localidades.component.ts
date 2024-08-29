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

  ngOnInit(): void{

  }

  loadLocalidades(){
    return this.service.getLocalidades().subscribe(response => this.list = response);
  }
}
