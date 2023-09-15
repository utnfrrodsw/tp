import { Injectable } from '@angular/core';

export interface Libro {
  titulo: string;
  descripcion: string;
  precio: number;
  imagen: string;
  autor: string;
  editorial: string;
  fechaEdicion: Date;
}

@Injectable({
  providedIn: 'root',
})
export class LibrosService {
  private libros: Libro[] = [
    {
      titulo: 'Libro 1',
      descripcion:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ...',
      precio: 3500,
      imagen: 'assets/img/Libros/Clean Code.webp',
      autor: 'Robert C. Martin',
      editorial: 'Prentice Hall',
      fechaEdicion: new Date(2008, 7, 11),
    },
    {
      titulo: 'Libro 2',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      precio: 1999,
      imagen:
        'assets/img/Libros/Introducción a la Programación Estructurada en C.jpg',
      autor: 'Luis Joyanes Aguilar',
      editorial: 'McGraw Hill',
      fechaEdicion: new Date(2000, 0, 1),
    },
    {
      titulo: 'Libro 3',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      precio: 8599,
      imagen: 'assets/img/Libros/Learning Python.png',
      autor: 'Mark Lutz',
      editorial: 'O’Reilly Media',
      fechaEdicion: new Date(2013, 6, 6),
    },
    {
      titulo: 'Libro 4',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      precio: 19899,
      imagen: 'assets/img/Libros/Sistemas Operativos Modernos.webp',
      autor: 'Andrew S. Tanenbaum',
      editorial: 'Pearson',
      fechaEdicion: new Date(2015, 1, 15),
    },
    {
      titulo: 'Libro 5',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      precio: 5099,
      imagen: 'assets/img/Libros/Design Patterns.jpg',
      autor: 'Erich Gamma',
      editorial: 'Addison-Wesley Professional',
      fechaEdicion: new Date(1994, 10, 10),
    },
  ];

  constructor() {}

  getLibros(): Libro[] {
    return this.libros;
  }
}
