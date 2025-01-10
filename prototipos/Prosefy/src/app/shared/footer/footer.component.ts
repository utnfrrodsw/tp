import { Component } from '@angular/core';
import { nombreSitio } from '../constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  nombreSitio = nombreSitio;
  currentYear: number = new Date().getFullYear();
}
