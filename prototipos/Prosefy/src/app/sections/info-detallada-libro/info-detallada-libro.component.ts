import { Component, Input, OnInit } from '@angular/core';
import { Libro, LibrosService } from '../../services/libros.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Autor, AutoresService } from '../../services/autores.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-info-detallada-libro',
  templateUrl: './info-detallada-libro.component.html',
  styleUrls: ['./info-detallada-libro.component.css'],
})
export class InfoDetalladaLibroComponent /*implements OnInit*/ {
  libro: Libro | undefined;
  autores: Autor[] = []; // Array para almacenar la información de los autores

  constructor(
    private librosService: LibrosService,
    private autoresService: AutoresService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  /*
  ngOnInit() {
    if (this.route && this.route.paramMap) {
      this.route.paramMap.subscribe((params) => {
        const idParam = params.get('id');

        if (idParam !== null) {
          const libroId = parseInt(idParam, 10);
          this.libro = this.librosService.getLibroById(libroId);

          if (this.libro && this.libro.autores) {
            const observables: Observable<Autor | undefined>[] = this.libro.autores.map((idAutor) => this.getAutor(idAutor));
            forkJoin(observables).subscribe((autores) => {
              this.autores = autores.filter((autor) => !!autor) as Autor[];
            });
          }
        } else {
          this.router.navigate(['/inicio']);
        }
      });
    }
  }*/

  formatearFecha(fecha: Date): string {
    const fechaFormateada = this.datePipe.transform(fecha, 'dd MMMM', 'es');
    if (fechaFormateada) {
      const año = fecha.getFullYear().toString();
      return `${fechaFormateada} del ${año}`;
    } else {
      return '';
    }
  }
  formatearSinopsisConSaltosDeLinea(sinopsis: string | undefined): string {
    if (sinopsis) {
      return sinopsis.replace(/\n/g, '<br><br>');
    } else {
      return '';
    }
  }

  getAutor(id: string): Observable<Autor | undefined> {
    return this.autoresService.getAutor(id);
  }
}