import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Libro, LibrosService } from '../../services/libros.service';
import { CurrencyService } from '../../services/currency.service';
import { switchMap, catchError } from 'rxjs/operators';
import { Observable, throwError, Subscription } from 'rxjs';
import { ParamMap } from '@angular/router';
import { CarritoComprasService } from '../../services/carrito-compras.service';

@Component({
  selector: 'app-info-libro-seleccionado',
  templateUrl: './info-libro-seleccionado.component.html',
  styleUrls: ['./info-libro-seleccionado.component.css'],
})
export class InfoLibroSeleccionadoComponent implements OnInit, OnDestroy {
  libro: Libro | undefined;
  libroAgregado: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(
    public currencyService: CurrencyService,
    private librosService: LibrosService,
    private route: ActivatedRoute,
    private router: Router,
    private carritoService: CarritoComprasService
  ) { }

  ngOnInit() {
    this.subscription.add(
      this.route.paramMap.pipe(
        switchMap((params: ParamMap) => {
          const idParam = params.get('id');
          if (!idParam) {
            this.handleError('ID del libro no válido.');
            return throwError('ID del libro no válido.');
          }

          // Utiliza directamente idParam en lugar de parseInt
          return this.librosService.getLibro(idParam).pipe(
            catchError((error) => {
              this.handleError(`Error obteniendo el libro con ID ${idParam}: ${error}`);
              return throwError(`No se encontró el libro con ID ${idParam}`);
            })
          );
        })
      ).subscribe(
        (foundLibro: Libro | undefined) => {
          if (foundLibro) {
            this.libro = foundLibro;
          }
        },
        error => {
          this.handleError('Error al cargar el libro.');
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getPrice(): number | undefined {
    return this.libro?.precio;
  }

  calculatePriceInSelectedCurrency(precio: number): number {
    return this.currencyService.calculatePriceInSelectedCurrency(precio);
  }

  agregarAlCarrito() {
    if (this.libro && this.libro.id) {
      this.carritoService.agregarAlCarrito(this.libro.id);
      this.libroAgregado = true;
      this.mostrarMensaje();
    } else {
      this.handleError('ID del libro no definido.');
    }
  }

  mostrarMensaje() {
    setTimeout(() => {
      this.libroAgregado = false;
    }, 3000);
  }

  private handleError(errorMessage: string) {
    console.error(errorMessage);
    this.router.navigate(['/inicio']);
  }
}