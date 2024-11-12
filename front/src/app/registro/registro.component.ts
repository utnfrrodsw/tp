import { Component } from '@angular/core';
import { RegistroService } from '../registro.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})

export class RegistroComponent {
  constructor (private service: RegistroService){}
}
