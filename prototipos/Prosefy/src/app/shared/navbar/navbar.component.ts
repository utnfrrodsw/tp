import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  // Propiedad para controlar si está abierta una ventana emergente (popup)
  isPopupOpen = false;
  // Variable de estado para controlar la visibilidad de las opciones de usuario (si inició sesión)
  showUserOptions = false;

  constructor(public currencyService: CurrencyService) {}

  openPopup() {
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
  }

  setCurrency(currency: string): void {
    this.currencyService.setCurrency(currency);
  }
}
