import { Component, Input } from '@angular/core';
import { Volquete } from '../../../../../../../VolquetesFront/src/app/model/interfaces/volquete.interface.js';

@Component({
  selector: 'app-alta-volquete-form',
  standalone: true,
  imports: [],
  templateUrl: './alta-volquete-form.component.html',
  styleUrl: './alta-volquete-form.component.css'
})
export class AltaVolqueteFormComponent {
  @Input() nuevoVolquete!: Volquete;

}
