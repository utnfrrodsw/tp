import { Component, Input, OnInit } from '@angular/core';
import { Libro, LibrosService } from '../../services/libros.service';
import { Autor, AutoresService } from '../../services/autores.service';
import { Editorial, EditorialesService } from 'src/app/services/editoriales.service';
import { Categoria, CategoriasService } from 'src/app/services/categorias.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-info-detallada-libro',
  templateUrl: './info-detallada-libro.component.html',
  styleUrls: ['./info-detallada-libro.component.css'],
})
export class InfoDetalladaLibroComponent implements OnInit {
  libro: Libro | undefined;
  autores: Autor[] = [];
  editorial: Editorial | undefined;
  categorias: Categoria[] | undefined;

  constructor(
    private librosService: LibrosService,
    private autoresService: AutoresService,
    private editorialesService: EditorialesService,
    private categoriasService: CategoriasService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.route && this.route.paramMap) {
      this.route.paramMap
        .pipe(
          switchMap((params) => {
            const idParam = params.get('id');

            if (!idParam) {
              this.router.navigate(['/inicio']);
              return of(undefined);
            }

            return forkJoin({
              libro: this.librosService.getLibro(idParam),
              autores: this.librosService.getAutores(idParam) || [],
              editorial: this.librosService.getEditorial(idParam) || undefined,
              categorias: this.librosService.getCategorias(idParam) || [],
            });
          }),
          // ...
        )
        .subscribe((result) => {
          if (result && result.autores) {
            const observables: Observable<Autor | undefined>[] = result.autores
              .filter((autorId) => typeof autorId === 'string')
              .map((autorId) => this.autoresService.getAutor(autorId) || of(undefined));

            forkJoin(observables).subscribe((autores: (Autor | undefined)[]) => {
              this.autores = autores.filter((autor) => !!autor) as Autor[];
            });
          }
        });
    }
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

  formatearSinopsisConSaltosDeLinea(sinopsis: string | undefined): string {
    if (sinopsis) {
      return sinopsis.replace(/\n/g, '<br><br>');
    } else {
      return '';
    }
  }

  obtenerNombresAutores(): string {
    if (this.autores && this.autores.length > 0) {
      return this.autores.map((autor) => autor.nombreCompleto).join(', ');
    } else {
      return '';
    }
  }

  obtenerNombresCategorias(): string {
    if (this.categorias && this.categorias.length > 0) {
      return this.categorias.map((categoria) => categoria.descripcion).join(', ');
    } else {
      return '';
    }
  }
}
