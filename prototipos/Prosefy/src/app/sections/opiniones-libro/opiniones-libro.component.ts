import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Libro, LibrosService } from '../../services/libros.service';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-opiniones-libro',
  templateUrl: './opiniones-libro.component.html',
  styleUrls: ['./opiniones-libro.component.css'],
})
export class OpinionesLibroComponent implements OnInit {
  libro: Libro | undefined;

  constructor(
    private librosService: LibrosService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const idParam = params.get('id');

        if (idParam) {
          // Convertir idParam a string
          const libroId = idParam.toString();
          return this.librosService.getLibro(libroId);
        } else {
          this.router.navigate(['/inicio']);
          return of(null);
        }
      }),
      catchError(error => {
        console.error('Error obteniendo el libro:', error);
        return of(null);
      })
    ).subscribe(libro => {
      this.libro = libro as Libro;
    });
  }
}
