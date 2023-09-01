import { Component } from '@angular/core';
import { nombreSitio } from '../app/shared/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  nombreSitio = nombreSitio;
}
