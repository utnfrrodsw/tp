import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Libro, LibrosService } from '../../services/libros.service';
import { CurrencyService } from '../../services/currency.service';
import { switchMap, catchError, delay } from 'rxjs/operators';
import { Observable, throwError, Subscription, of } from 'rxjs';
import { ParamMap } from '@angular/router';
import { CarritoComprasService } from '../../services/carrito-compras.service';
import { IniciarSesionService } from '../../services/iniciar-sesion.service';

@Component({
  selector: 'app-info-libro-seleccionado',
  templateUrl: './info-libro-seleccionado.component.html',
  styleUrls: ['./info-libro-seleccionado.component.css'],
})
export class InfoLibroSeleccionadoComponent implements OnInit, OnDestroy {
  libro: Libro | undefined;
  libroAgregado: boolean = false;
  private subscription: Subscription = new Subscription();
  isLoggedIn: boolean = false;

  constructor(
    public currencyService: CurrencyService,
    public librosService: LibrosService,
    private route: ActivatedRoute,
    private router: Router,
    public carritoService: CarritoComprasService,
    private iniciarSesionService: IniciarSesionService
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
        (error: any) => {
          this.handleError('Error al cargar el libro.');
        }
      )
    );

    this.iniciarSesionService.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });
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

  agregarAlCarrito(libro: Libro | undefined) {

    const libroId = libro?._id;

    if (libroId) {
      this.carritoService.agregarAlCarrito(libroId);
      this.libroAgregado = true;
      this.mostrarMensaje();
    } else {
      this.handleError('ID del libro no definido.');
    }
  }

  comprarAhora(libro: Libro | undefined) {
    this.agregarAlCarrito(libro);
    this.router.navigate(['/carrito-compras']);
  }

  mostrarMensaje() {
    this.libroAgregado = true;
    this.subscription.add(
      of(null).pipe(delay(3000)).subscribe(() => {
        this.libroAgregado = false;
      })
    );
  }

  private handleError(errorMessage: string) {
    console.error(errorMessage);
    this.router.navigate(['/inicio']);
  }
}