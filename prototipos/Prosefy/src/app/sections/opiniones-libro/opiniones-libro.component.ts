import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Libro, LibrosService } from '../../services/libros.service';

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
  ) {}

  ngOnInit() {
    // Obtener el valor del parámetro ":id" desde la URL
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');

      if (idParam !== null) {
        const libroId = parseInt(idParam, 10);

        // Obtener el libro por ID utilizando el servicio de libros
        this.libro = this.librosService.getLibroById(libroId);
      } else {
        // Redirigir a la página de inicio
        this.router.navigate(['/inicio']);
      }
    });
  }
}
