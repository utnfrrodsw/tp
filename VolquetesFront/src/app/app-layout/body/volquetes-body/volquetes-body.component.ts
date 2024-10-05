import { Component } from '@angular/core';
import { AltaVolqueteComponent } from "./alta-volquete/alta-volquete.component";

@Component({
  selector: 'app-volquetes-body',
  standalone: true,
  imports: [AltaVolqueteComponent],
  templateUrl: './volquetes-body.component.html',
  styleUrl: './volquetes-body.component.css'
})
export class VolquetesBodyComponent {

}
