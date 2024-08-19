import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolqueteModel } from '../../../../../../../../VolquetesFront/src/app/model/interfaces/volquete.interface.js'
import { Volquete } from '../../../../../../../../VolquetesFront/src/app/model/interfaces/volquete.interface.js';



@Component({
  selector: 'app-lista-volquetes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-volquetes.component.html',
  styleUrl: './lista-volquetes.component.css',
})
export class ListaVolquetesComponent {
  @Input() volquete!: Volquete;

  listaVolquetes: VolqueteModel[] = [];
}
