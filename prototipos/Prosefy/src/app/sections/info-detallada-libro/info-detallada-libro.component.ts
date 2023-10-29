import { Component, Input, OnInit } from '@angular/core';
import { Libro, LibrosService } from '../../services/libros.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Autor, AutoresService } from '../../services/autores.service';

@Component({
  selector: 'app-info-detallada-libro',
  templateUrl: './info-detallada-libro.component.html',
  styleUrls: ['./info-detallada-libro.component.css'],
})
export class InfoDetalladaLibroComponent implements OnInit {
  libro: Libro | undefined;
  autores: Autor[] = []; // Array para almacenar la información de los autores


  constructor(
    private librosService: LibrosService,
    private autoresService: AutoresService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Obtener el valor del parámetro ":id" desde la URL
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');

      if (idParam !== null) {
        const libroId = parseInt(idParam, 10);

        // Obtener el libro por ID utilizando el servicio de libros
        this.libro = this.librosService.getLibroById(libroId);

        // Obtener la información de los autores
        if (this.libro && this.libro.autores) {
          this.libro.autores.forEach((nombreAutor) => {
            const autor = this.autoresService.getAutorByNombre(nombreAutor);
            if (autor) {
              this.autores.push(autor);
            }
          });
        }
      } else {
        // Redirigir a la página de inicio
        this.router.navigate(['/inicio']);
      }
    });
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
}