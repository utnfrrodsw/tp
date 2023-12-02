import { Component, OnInit } from '@angular/core';
import { Libro, LibrosService } from '../../services/libros.service';
import { AutoresService } from '../../services/autores.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, combineLatest } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Editorial, EditorialesService } from 'src/app/services/editoriales.service';

@Component({
  selector: 'app-info-detallada-libro',
  templateUrl: './info-detallada-libro.component.html',
  styleUrls: ['./info-detallada-libro.component.css'],
})
export class InfoDetalladaLibroComponent implements OnInit {
  libro: Libro | undefined;
  autoresNombres: { [key: string]: string[] } = {};
  categoriasDescripcion: { [key: string]: string[] } = {};
  editorialDescripcion: { [key: string]: string } = {};

  constructor(
    public librosService: LibrosService,
    public autoresService: AutoresService,
    public categoriasService: CategoriasService,
    public editorialesService: EditorialesService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
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
          }).pipe(
            switchMap((result) => {
              if (!result.libro) {
                console.error('El libro no está definido.');
                return of(undefined);
              }

              const idsAutores = result.libro.autores || [];
              const nombresAutores$ = this.librosService.getAutoresObservables(idsAutores);

              const idsCategorias = result.libro.categorias || [];
              const descripcionesCategorias$ = this.librosService.getCategoriasObservables(idsCategorias);

              const idEditorial = result.libro.editorial || '';
              const descripcionEditorial$ = this.editorialesService.getDescripcion(idEditorial);

              return combineLatest({
                libro: of(result.libro),
                nombresAutores: nombresAutores$,
                descripcionesCategorias: descripcionesCategorias$.pipe(
                  map(descripciones => this.formatCategorias(descripciones))
                ),
                descripcionEditorial: descripcionEditorial$,
              });
            })
          );
        })
      )
      .subscribe({
        next: (result) => {
          if (result && result.libro) {
            const { libro, nombresAutores, descripcionesCategorias, descripcionEditorial } = result;
            this.autoresNombres[libro._id] = nombresAutores.split(', ');
            this.categoriasDescripcion[libro._id] = descripcionesCategorias.split(', ');
            this.editorialDescripcion[libro._id] = descripcionEditorial ?? '';

            this.libro = libro;
          } else {
            console.error('El ID del libro no está definido.');
          }
        },
        error: (error) => {
          console.error('Error obteniendo información: ', error);
        }
      });
  }

  formatCategorias(descripciones: string | string[]): string {
    if (Array.isArray(descripciones)) {
      if (descripciones.length > 1) {
        const primeraDescripcion = descripciones[0];
        const otrasDescripciones = descripciones.slice(1).map(desc => desc.charAt(0).toLowerCase() + desc.slice(1));
        return [primeraDescripcion, ...otrasDescripciones].join(', ');
      }
      return descripciones.join(', ');
    }

    // Si descripciones no es un array, simplemente devolverlo
    return descripciones || '';
  }

  private getNombresAutores(idsAutores: string[]) {
    return forkJoin(idsAutores.map((id) => this.autoresService.getNombreCompleto(id))).pipe(
      catchError((error) => {
        console.error('Error obteniendo nombres de autores: ', error);
        return of([]);
      })
    );
  }

  private getDescripcionesCategorias(idsCategorias: string[]) {
    return forkJoin(idsCategorias.map((id) => this.categoriasService.getDescripcion(id))).pipe(
      catchError((error) => {
        console.error('Error obteniendo descripciones de categorías: ', error);
        return of([]);
      })
    );
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

  formatearSinopsisConSaltosDeLinea(sinopsis: string | undefined): string {
    return sinopsis ? sinopsis.replace(/\n/g, '<br><br>') : '';
  }
}