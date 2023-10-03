import { Component, OnInit } from '@angular/core';
import { Libro, LibrosService } from '../../services/libros.service';
import { CurrencyService } from '../../services/currency.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css'],
})
export class ResultadosComponent {
  libros: Libro[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  constructor(
    private librosService: LibrosService,
    public currencyService: CurrencyService,
    private datePipe: DatePipe
  ) {}

  deseos: { [libroId: string]: boolean } = {}; // Objeto para mantener el estado de deseos para cada libro
  pulsateStates: { [libroId: string]: boolean } = {}; // Objeto para mantener el estado de animación para cada libro

  ngOnInit(): void {
    this.libros = this.librosService.getLibros();
  }

  calculatePriceInSelectedCurrency(precio: number): number {
    return this.currencyService.calculatePriceInSelectedCurrency(precio);
  }

  formatearFecha(fecha: Date): string {
    const fechaFormateada = this.datePipe.transform(fecha, 'dd MMMM', 'es');
    if (fechaFormateada) {
      const año = fecha.getFullYear().toString();
      return `${fechaFormateada} del ${año}`;
    } else {
      return '';
    }
  }

  toggleDeseo(libro: any): void {
    const libroId = libro.id ? libro.id.toString() : '';
    this.deseos[libroId] = !this.deseos[libroId];
    this.pulsateStates[libroId] = true; // Activar la animación al hacer clic

    setTimeout(() => {
      this.pulsateStates[libroId] = false;
    }, 500);
  }

  isInDeseos(libro: any): boolean {
    const libroId = libro.id.toString();
    return this.deseos[libroId] || false;
  }
  pageChanged(event: any): void {
    this.currentPage = event.page;
  }
  get totalPages(): number {
    return Math.ceil(this.libros.length / this.itemsPerPage);
  }
}
