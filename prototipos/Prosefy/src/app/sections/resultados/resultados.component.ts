import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Libro, LibrosService } from '../../services/libros.service';
import { CurrencyService } from '../../services/currency.service';
import { DatePipe } from '@angular/common';
import { switchMap, catchError, map } from 'rxjs/operators';
import { Editorial, EditorialesService } from 'src/app/services/editoriales.service';
import { Autor, AutoresService } from 'src/app/services/autores.service';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css'],
})
export class ResultadosComponent implements OnInit {
  librosIds: string[] = [];
  librosData: { [key: string]: Libro } = {};
  currentPage = 1;
  itemsPerPage = 5;
  deseos: { [libroId: string]: boolean } = {};
  pulsateStates: { [libroId: string]: boolean } = {};

  constructor(
    private librosService: LibrosService,
    public currencyService: CurrencyService,
    private datePipe: DatePipe,
    private editorialesService: EditorialesService,
  ) { }

  ngOnInit(): void {
    this.librosService.getLibrosIds().pipe(
      switchMap((librosIds: string[]) => {
        this.librosIds = librosIds;

        const requests = librosIds.map(id =>
          forkJoin({
            libro: this.librosService.getLibro(id),
          }).pipe(
            map(({ libro }) => ({ id, libro })),
            catchError(error => {
              console.error(`Error obteniendo datos del libro con ID ${id}: ${error}`);
              return [];
            })
          )
        );
        // Combina todos los observables en un solo observable que emite un array de libros
        return forkJoin(requests);
      })
    ).subscribe((libros) => {
      console.log("Libros Data: ", libros);
      libros.forEach(({ id, libro }) => {
        if (libro) {
          this.librosData[id] = libro;
        }
      });
    });
  }

  calculatePriceInSelectedCurrency(precio: number): number {
    return this.currencyService.calculatePriceInSelectedCurrency(precio);
  }

  formatearFecha(fecha: Date | undefined): string {
    if (fecha instanceof Date) {
      const fechaFormateada = this.datePipe.transform(fecha, 'dd MMMM', 'es');
      if (fechaFormateada) {
        const año = fecha.getFullYear().toString();
        return `${fechaFormateada} del ${año}`;
      }
    }
    return 'N/A';
  }

  toggleDeseo(libro: any): void {
    const libroId = libro.id ? libro.id.toString() : '';
    this.deseos[libroId] = !this.deseos[libroId];
    this.pulsateStates[libroId] = true;

    setTimeout(() => {
      this.pulsateStates[libroId] = false;
    }, 500);
  }

  isInDeseos(libro: any): boolean {
    if (libro && libro.id) {
      const libroId = libro.id.toString();
      return this.deseos[libroId] || false;
    }
    return false;
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  get totalPages(): number {
    return Math.ceil(this.librosIds.length / this.itemsPerPage);
  }

  getDescripcion(libroId: string): Observable<string | undefined> {
    return this.librosService.getEditorial(libroId).pipe(
      switchMap(editorialId => this.editorialesService.getDescripcion(editorialId || ''))
    );
  }
}