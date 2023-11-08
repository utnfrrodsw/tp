import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Libro, LibrosService } from '../../services/libros.service';
import { CurrencyService } from '../../services/currency.service';
import { DatePipe } from '@angular/common';
import { AutoresService, Autor } from '../../services/autores.service';

// TODO: Mostrar libros de autor y actualizar cuando se elige otro libro

@Component({
  selector: 'app-libros-autor',
  templateUrl: './libros-autor.component.html',
  styleUrls: ['./libros-autor.component.css']
})
export class LibrosAutorComponent /* implements OnInit */ {
  /* 
  @Input() autores: Autor[] | undefined;
  showMore = false;
  libros: Libro[] = [];
  currentPage = 1;
  itemsPerPage = 4;
  deseos: { [libroId: string]: boolean } = {}; // Objeto para mantener el estado de deseos para cada libro
  pulsateStates: { [libroId: string]: boolean } = {}; // Objeto para mantener el estado de animación para cada libro

  constructor(
    private librosService: LibrosService,
    public currencyService: CurrencyService,
    private datePipe: DatePipe,
    private autoresService: AutoresService
  ) { }

  ngOnInit() {
    this.autoresService.getAutores().subscribe((autores) => {
      this.autores = autores;
    });
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

  shouldShowMoreLink(autorData: Autor | undefined): boolean {
    return autorData !== undefined && autorData.info !== undefined && autorData.info.length > 150;
  }


  getShortenedInfo(autorData: Autor): string {
    if (autorData && autorData.info) {
      return this.showMore ? autorData.info : autorData.info.slice(0, 60) + "...";
    }
    return '';
  }*/
}
