import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-headernav',
  templateUrl: './headernav.component.html',
  styleUrls: ['./headernav.component.css'],
})
export class HeadernavComponent {
  // Propiedad para controlar si el encabezado se ha desplazado
  headerScrolled = false;
  // Propiedad para controlar si está abierta una ventana emergente (popup)
  isPopupOpen = false;
  // Propiedad searchPlaceholder para cambiar el título de la barra de búsqueda
  placeholderText = 'Buscar...'; // Valor predeterminado

  constructor(private router: Router, public currencyService: CurrencyService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updatePlaceholder(event.url);
      }
    });
  }

  openPopup() {
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
  }

  private updatePlaceholder(url: string) {
    if (url.includes('/inicio')) {
      this.placeholderText = 'Buscar libros...';
    } else if (url.includes('/autores')) {
      this.placeholderText = 'Buscar autores...';
    } else if (url.includes('/editoriales')) {
      this.placeholderText = 'Buscar editoriales...';
    } else if (url.includes('/ayuda')) {
      this.placeholderText = 'Buscar en ayuda...';
    } else {
      this.placeholderText = 'Buscar...';
    }
  }

  setCurrency(currency: string): void {
    this.currencyService.setCurrency(currency);
  }
}
