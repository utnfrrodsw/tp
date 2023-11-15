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

            if (idParam !== null) {
              const libroId = parseInt(idParam, 10);

              if (isNaN(libroId)) {
                this.router.navigate(['/inicio']);
                return of(undefined);
              }

              return forkJoin({
                libro: this.librosService.getLibro(libroId.toString()),
                autores: this.librosService.getAutores(libroId.toString()) || [],
                editorial: this.librosService.getEditorial(libroId.toString()) || undefined,
                categorias: this.librosService.getCategorias(libroId.toString()) || [],
              });
            } else {
              this.router.navigate(['/inicio']);
              return of(undefined);
            }
          }),
          switchMap((result) => {
            if (!result || !result.libro) {
              return of({ autores: [], editorial: undefined, categorias: [] });
            }

            this.libro = result.libro;
            this.editorial = result.editorial as Editorial | undefined;
            this.categorias = result.categorias as Categoria[] | undefined;

            const observables: Observable<Autor | undefined>[] = this.libro.autores.map((idAutor) =>
              this.autoresService.getAutor(idAutor)
            );

            return forkJoin(observables).pipe(
              map((autores) => ({ autores, editorial: this.editorial, categorias: this.categorias }))
            );
          }),
          catchError((error) => {
            console.error('Error en la solicitud:', error);
            return of({ autores: [], editorial: undefined, categorias: [] });
          })
        )
        .subscribe((result) => {
          this.autores = result.autores.filter((autor) => !!autor) as Autor[];
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
