import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Libro, LibrosService } from '../../services/libros.service';
import { CurrencyService } from '../../services/currency.service';

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
    if (this.route && this.route.paramMap) {
      this.route.paramMap.subscribe((params) => {
        const idParam = params.get('id');

        if (idParam !== null) {
          const libroId = parseInt(idParam, 10);

          this.libro = this.librosService.getLibroById(libroId);
        } else {
          this.router.navigate(['/inicio']);
        }
      });
    }
  }

  calculatePriceInSelectedCurrency(precio: number): number {
    return this.currencyService.calculatePriceInSelectedCurrency(precio);
  }
}
