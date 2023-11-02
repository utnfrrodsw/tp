import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Libro, LibrosService } from '../../services/libros.service';
import { CurrencyService } from '../../services/currency.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-info-libro-seleccionado',
  templateUrl: './info-libro-seleccionado.component.html',
  styleUrls: ['./info-libro-seleccionado.component.css'],
})
export class InfoLibroSeleccionadoComponent implements OnInit {
  libro: Libro | undefined;

  constructor(
    public currencyService: CurrencyService,
    private librosService: LibrosService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const idParam = params.get('id');
        if (idParam) {
          const libroId = parseInt(idParam, 10);
          const foundLibro = this.librosService.getLibroById(libroId);
          if (foundLibro) {
            return of(foundLibro);
          } else {
            console.error(`No se encontró el libro con ID ${libroId}`);
            this.router.navigate(['/inicio']);
            return of(undefined);
          }
        } else {
          this.router.navigate(['/inicio']);
          return of(undefined);
        }
      })
    ).subscribe((foundLibro: Libro | undefined) => {
      if (foundLibro) {
        this.libro = foundLibro;
      }
    });
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
}