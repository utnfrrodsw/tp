import { Component, OnInit, HostListener } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { Libro, LibrosService } from '../../services/libros.service';
import { forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-libros',
  templateUrl: './lista-libros.component.html',
  styleUrls: ['./lista-libros.component.css'],
})
export class ListaLibrosComponent implements OnInit {
  elementosAlInicio = true;
  elementosAlFinal = false;
  librosIds: string[] = [];
  librosData: { [key: string]: Libro } = {};
  librosAMostrar: Libro[] = [];

  elementoActual = 0;
  elementosPorPaso = 5;
  descripcionMaxLength = 60;

  constructor(
    public currencyService: CurrencyService,
    private librosService: LibrosService,
    private router: Router
  ) { }

  ngOnInit() {
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
        }
      });
      this.actualizarLibrosAMostrar();
    });
  }

  navegarALibro(libroId: string) {
    // Cambiar la URL sin recargar la página
    this.router.navigate(['/libro-seleccionado', libroId]);
  }

  moverIzquierda() {
    if (this.elementoActual > 0) {
      this.elementoActual -= this.elementosPorPaso;
      this.actualizarLibrosAMostrar();
    }
    this.elementosAlFinal = false;
    this.elementosAlInicio = this.elementoActual === 0;
  }

  moverDerecha() {
    if (this.elementoActual < this.librosIds.length - this.elementosPorPaso) {
      this.elementoActual += this.elementosPorPaso;
      this.actualizarLibrosAMostrar();
    }
    this.elementosAlInicio = false;
    this.elementosAlFinal = this.elementoActual + this.elementosPorPaso >= this.librosIds.length;
  }

  actualizarLibrosAMostrar() {
    const fin = Math.min(this.elementoActual + this.elementosPorPaso, this.librosIds.length);
    this.librosAMostrar = this.librosIds.slice(this.elementoActual, fin)
      .map(id => this.librosData[id]);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth < 619) {
      this.elementosPorPaso = 2;
    } else if (window.innerWidth < 767) {
      this.elementosPorPaso = 3;
    } else if (window.innerWidth < 1000) {
      this.elementosPorPaso = 4;
    } else {
      this.elementosPorPaso = 5;
    }

    if (this.elementoActual + this.elementosPorPaso > (this.librosIds.length || 0)) {
      this.elementoActual = (this.librosIds.length || 0) - this.elementosPorPaso;
    }
    this.actualizarLibrosAMostrar();
  }

  calculatePriceInSelectedCurrency(precio: number): number {
    return this.currencyService.calculatePriceInSelectedCurrency(precio);
  }

  calcularAlturaImagen(): number {
    // Definir la altura deseada, por ejemplo, 200 píxeles
    const alturaDeseada = 300;

    // Devuelve la altura deseada
    return alturaDeseada;
  }
}