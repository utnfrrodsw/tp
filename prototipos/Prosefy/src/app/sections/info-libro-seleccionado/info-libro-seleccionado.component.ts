import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Libro, LibrosService } from '../../services/libros.service';
import { CurrencyService } from '../../services/currency.service';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { CarritoComprasService } from '../../services/carrito-compras.service';


@Component({
  selector: 'app-info-libro-seleccionado',
  templateUrl: './info-libro-seleccionado.component.html',
  styleUrls: ['./info-libro-seleccionado.component.css'],
})
export class InfoLibroSeleccionadoComponent implements OnInit {
  libro: Libro | undefined;
  libroAgregado: boolean = false;

  constructor(
    public currencyService: CurrencyService,
    private librosService: LibrosService,
    private route: ActivatedRoute,
    private router: Router,
    private carritoService: CarritoComprasService
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const idParam = params.get('id');
        if (!idParam || isNaN(parseInt(idParam, 10))) {
          this.router.navigate(['/inicio']);
          return throwError('ID del libro no válido.');
        }

        const libroId = idParam.toString(); // Convertir a cadena
        return this.librosService.getLibro(libroId).pipe(
          catchError((error) => {
            console.error(`Error obteniendo el libro con ID ${libroId}:`, error);
            this.router.navigate(['/inicio']);
            return throwError(`No se encontró el libro con ID ${libroId}`);
          })
        );
      }),
      tap((foundLibro: Libro | undefined) => {
        if (foundLibro) {
          this.libro = foundLibro;
        }
      })
    ).subscribe();
  }

  getPrice(): number | undefined {
    if (this.libro && this.libro.precio !== undefined) {
      return this.libro.precio;
    } else {
      console.error('La propiedad precio no está definida en el objeto libro.');
      return undefined;
    }
  }

  calculatePriceInSelectedCurrency(precio: number): number {
    return this.currencyService.calculatePriceInSelectedCurrency(precio);
  }

  agregarAlCarrito() {
    if (this.libro && this.libro.id) {
      let libroId = this.libro.id;
      this.carritoService.agregarAlCarrito(libroId); // Utilizar el servicio para agregar el libro al carrito
      this.libroAgregado = true;
      this.mostrarMensaje();
    } else {
      console.error('ID del libro no definido.');
    }
  }

  mostrarMensaje() {
    this.libroAgregado = true;
    setTimeout(() => {
      this.libroAgregado = false;
    }, 3000);
  }

}