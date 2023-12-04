import { Component, OnInit } from '@angular/core';
import { Libro, LibrosService } from '../../services/libros.service';
import { forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-crud-libros',
  templateUrl: './crud-libros.component.html',
  styleUrls: ['./crud-libros.component.css']
})
export class CrudLibrosComponent implements OnInit {
  librosIds: string[] = [];
  librosData: { [key: string]: Libro } = {};

  constructor(private librosService: LibrosService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.librosService.getLibrosIds().pipe(
      switchMap((librosIds: string[]) => {
        this.librosIds = librosIds;

        const requests = librosIds.map(id =>
          forkJoin({
            libro: this.librosService.getLibro(id),
          }).pipe(
            map(({ libro }) => ({ id, libro })),
            catchError(error => {
              console.error(`Error obteniendo datos del libro con ID ${id}: ${error}`);
              return [];
            })
          )
        );

        return forkJoin(requests);
      })
    ).subscribe((libros) => {

      libros.forEach(({ id, libro }) => {
        if (libro) {
          this.librosData[id] = libro;
        }
      });
    });
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
}