import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isPopupOpen = false;
  showUserOptions = false;
  categorias: string[] = [];
  loading = true; // Indicador de carga

  constructor(public currencyService: CurrencyService, private categoriasService: CategoriasService) { }

  ngOnInit() {
    this.categoriasService.obtenerDescripcionesCategoria().subscribe(
      (data: string[]) => {
        this.categorias = data; // Asigna directamente el array de strings
        this.loading = false; // Datos cargados
      },
      (error) => {
        console.error('Error al cargar las categorías:', error);
        this.loading = false; // Manejo de errores
      }
    );
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