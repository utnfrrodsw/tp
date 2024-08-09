import { Component } from '@angular/core';
import { AltaFormComponent } from "./tipo-volquetes-form/tipo-volquetes-form.component";
import { AltaVolqueteComponent } from "./alta-volquete/alta-volquete.component";

@Component({
  selector: 'app-volquetes-body',
  standalone: true,
  imports: [AltaFormComponent, AltaVolqueteComponent],
  templateUrl: './volquetes-body.component.html',
  styleUrl: './volquetes-body.component.css'
})
export class VolquetesBodyComponent {

}
