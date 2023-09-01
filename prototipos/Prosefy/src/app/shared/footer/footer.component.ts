import { Component } from '@angular/core';
import { nombre_sitio } from '../constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  nombre_sitio = nombre_sitio;
}
