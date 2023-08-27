import { Component } from '@angular/core';
import { nombre_sitio } from '../app/shared/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  nombre_sitio = nombre_sitio;
}
