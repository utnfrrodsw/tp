import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CurrencyService } from '../../services/currency.service';
import { PopupLocalidadComponent } from '../popup-localidad/popup-localidad.component';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  // Propiedad para controlar si está abierta una ventana emergente (popup)
  isPopupOpen = false;
  // Variable de estado para controlar la visibilidad de las opciones de usuario (si inició sesión)
  showUserOptions = false;
  categorias: string[] = [];

  constructor(public currencyService: CurrencyService, private categoriasService: CategoriasService) { }

  ngOnInit() {
    this.categoriasService.getCategorias().subscribe((data: string[]) => {
      this.categorias = data;
    });
  }

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
