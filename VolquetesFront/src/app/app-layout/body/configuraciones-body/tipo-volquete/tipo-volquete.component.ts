import { Component } from '@angular/core';
import { TipoVolquetesListComponent } from './tipo-volquetes-list/tipo-volquetes-list.component.js';
import { TipoVolqueteFormComponent } from './tipo-volquetes-form/tipo-volquetes-form.component.js';

@Component({
  selector: 'app-tipo-volquete',
  standalone: true,
  imports: [TipoVolquetesListComponent, TipoVolqueteFormComponent],
  templateUrl: './tipo-volquete.component.html',
  styleUrl: './tipo-volquete.component.css'
})
export class TipoVolqueteComponent {

}
