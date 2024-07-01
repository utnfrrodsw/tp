import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolqueteModel } from '../../../../../../model/volquete.interface.js';
import { Volquete } from '../../../../../../model/volquete.interface.js';



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
