import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

export interface Libro {
  titulo: string;
  descripcion: string;
  precio: number;
  imagen: string;
  autor: string;
  editorial: string;
  fechaEdicion: Date;
  calificacion: number;
}

@Injectable({
  providedIn: 'root',
})
export class LibrosService {
  private libros: Libro[] = [
    {
      titulo: 'Clean Code',
      descripcion:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ...',
      precio: 3500,
      imagen: 'assets/img/Libros/Clean Code.webp',
      autor: 'Robert C. Martin',
      editorial: 'Prentice Hall',
      fechaEdicion: new Date(2008, 7, 11),
      calificacion: 5,
    },
    {
      titulo: 'Introducción a la Programación Estructurada en C',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      precio: 1999,
      imagen:
        'assets/img/Libros/Introducción a la Programación Estructurada en C.jpg',
      autor: 'Luis Joyanes Aguilar',
      editorial: 'McGraw Hill',
      fechaEdicion: new Date(2000, 0, 1),
      calificacion: 4,
    },
    {
      titulo: 'Learning Python',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      precio: 8599,
      imagen: 'assets/img/Libros/Learning Python.png',
      autor: 'Mark Lutz',
      editorial: 'O’Reilly Media',
      fechaEdicion: new Date(2013, 6, 6),
      calificacion: 4,
    },
    {
      titulo: 'Sistemas Operativos Modernos',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      precio: 19899,
      imagen: 'assets/img/Libros/Sistemas Operativos Modernos.webp',
      autor: 'Andrew S. Tanenbaum',
      editorial: 'Pearson',
      fechaEdicion: new Date(2015, 1, 15),
      calificacion: 3,
    },
    {
      titulo: 'Design Patterns',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      precio: 5099,
      imagen: 'assets/img/Libros/Design Patterns.jpg',
      autor: 'Erich Gamma',
      editorial: 'Addison-Wesley Professional',
      fechaEdicion: new Date(1994, 10, 10),
      calificacion: 5,
    },
  ];

  constructor(private datePipe: DatePipe) {}

  getLibros(): Libro[] {
    return this.libros;
  }
}
