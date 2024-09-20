import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaVolquetesComponent } from './lista-volquetes/lista-volquetes.component.js';
import { Volquete } from '../../../../../../../VolquetesFront/src/app/model/interfaces/volquete.interface.js';


@Component({
  selector: 'app-consulta-volquete',
  standalone: true,
  imports: [CommonModule, ListaVolquetesComponent],
  templateUrl: './consulta-volquete.component.html',
  styleUrl: './consulta-volquete.component.css',
})
export class ConsultaVolqueteComponent {
  
}
