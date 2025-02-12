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
  autoresNombres: { [key: string]: string[] } = {};
  currentPage = 1;
  itemsPerPage = 5;
  deseos: { [libroId: string]: boolean } = {};
  pulsateStates: { [libroId: string]: boolean } = {};

  constructor(
    private librosService: LibrosService,
    public currencyService: CurrencyService,
    private datePipe: DatePipe,
    private editorialesService: EditorialesService,
    private autoresService: AutoresService
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
        return forkJoin(requests);
      })
    ).subscribe((libros) => {
      libros.forEach(({ id, libro }) => {
        if (libro) {
          this.librosData[id] = libro;
          // Obtener los nombres de los autores usando el servicio AutoresService
          this.autoresService.getAutores().subscribe({
            next: (autores: Autor[]) => {
              const idsAutores = libro.autores || [];
              // Crear un array de observables para las solicitudes de nombres de autores
              const observables = idsAutores.map((autorId: string) =>
                this.autoresService.getNombreCompleto(autorId)
              );
              // Usar forkJoin para esperar a que todas las solicitudes se completen
              forkJoin(observables).pipe(
                map((nombres: (string | undefined)[]) => nombres.filter(nombre => !!nombre) as string[])
              ).subscribe({
                next: (nombresFiltrados: string[]) => {
                  // Asignar los nombres al arreglo autoresNombres
                  this.autoresNombres[id] = nombresFiltrados;
                },
                error: (error: any) => {
                  console.error('Error obteniendo autores:', error);
                }
              });
            },
            error: (error) => {
              console.error('Error obteniendo autores:', error);
            }
          });
        }
      });
    });
  }

  calculatePriceInSelectedCurrency(precio: number): number {
    return this.currencyService.calculatePriceInSelectedCurrency(precio);
  }

  formatearFecha(fecha: Date | string | undefined): string {
    if (fecha) {
      const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;

      if (fechaObj instanceof Date) {
        const fechaFormateada = this.datePipe.transform(fechaObj, 'dd/MM/yyyy', 'es');

        if (fechaFormateada) {
          return fechaFormateada;
        }
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