import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CurrencyService } from '../../services/currency.service';
import { Categoria, CategoriasService } from '../../services/categorias.service';

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
    this.categoriasService.getCategorias().subscribe((data: Categoria[]) => {
      this.categorias = data.map(categoria => {
        return categoria.descripcion;
      });
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