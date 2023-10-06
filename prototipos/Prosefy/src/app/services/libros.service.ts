import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

export interface Libro {
  id: number;
  isbn: string;
  titulo: string;
  descripcion: string;
  precio: number;
  imagen: string;
  autores: string[];
  editorial: string;
  fechaEdicion: Date;
  calificacion: number;
  categorias: string[];
  formatos: string[];
}

@Injectable({
  providedIn: 'root',
})
export class LibrosService {
  private libros: Libro[] = [
    {
      id: 1,
      isbn: '978-0132350884',
      titulo: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      descripcion:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ...',
      precio: 3500,
      imagen: 'assets/img/Libros/Clean Code.webp',
      autores: ['Robert C. Martin'],
      editorial: 'Prentice Hall',
      fechaEdicion: new Date(2008, 7, 11),
      calificacion: 4.4,
      categorias: ['Programación', 'Desarrollo de Software'],
      formatos: ['Físico', 'Digital'],
    },
    {
      id: 2,
      isbn: '978-8448129833',
      titulo: 'Introducción a la Programación Estructurada en C',
      descripcion:
        'Este libro proporciona una introducción sólida a la programación estructurada en el lenguaje C. Cubre los fundamentos de la programación y la sintaxis de C de manera clara y concisa..',
      precio: 15999,
      imagen:
        'assets/img/Libros/Introducción a la Programación Estructurada en C.jpg',
      autores: ['Luis Joyanes Aguilar'],
      editorial: 'McGraw Hill',
      fechaEdicion: new Date(2000, 0, 1),
      calificacion: 4,
      categorias: ['Programación', 'Desarrollo de Software'],
      formatos: ['Físico', 'Digital'],
    },
    {
      id: 3,
      isbn: '978-1449355739',
      titulo: 'Learning Python',
      descripcion:
        'Este libro es una guía completa para aprender Python, desde los conceptos básicos hasta temas avanzados. Ideal para principiantes y programadores experimentados que deseen dominar Python.',
      precio: 19999,
      imagen: 'assets/img/Libros/Learning Python.png',
      autores: ['Mark Lutz'],
      editorial: 'O’Reilly Media',
      fechaEdicion: new Date(2013, 6, 6),
      calificacion: 4,
      categorias: ['Programación', 'Desarrollo de Software'],
      formatos: ['Físico', 'Digital'],
    },
    {
      id: 4,
      isbn: '978-0133591620',
      titulo: 'Sistemas Operativos Modernos',
      descripcion:
        'Este libro explora los principios y conceptos fundamentales de los sistemas operativos modernos. Ofrece una comprensión profunda de cómo funcionan los sistemas operativos en la práctica.',
      precio: 19899,
      imagen: 'assets/img/Libros/Sistemas Operativos Modernos.webp',
      autores: ['Andrew S. Tanenbaum'],
      editorial: 'Pearson',
      fechaEdicion: new Date(2015, 1, 15),
      calificacion: 3,
      categorias: ['Programación', 'Desarrollo de Software'],
      formatos: ['Físico', 'Digital'],
    },
    {
      id: 5,
      isbn: '978-0201633610',
      titulo: 'Design Patterns',
      descripcion:
        'Este clásico libro introduce patrones de diseño en la programación de software. Explora soluciones probadas para problemas comunes de diseño de software.',
      precio: 5099,
      imagen: 'assets/img/Libros/Design Patterns.jpg',
      autores: ['Erich Gamma'],
      editorial: 'Addison-Wesley Professional',
      fechaEdicion: new Date(1994, 10, 10),
      calificacion: 5,
      categorias: ['Programación', 'Desarrollo de Software'],
      formatos: ['Físico', 'Digital'],
    },
    {
      id: 6,
      isbn: '978-9702606624',
      titulo: 'Ingeniería de Software: Un Enfoque Práctico',
      descripcion:
        'Una guía práctica para la ingeniería de software que aborda los aspectos esenciales del desarrollo de software, desde la planificación hasta la entrega.',
      precio: 39990,
      imagen:
        'assets/img/Libros/Ingeniería de Software. Un Enfoque Práctico.webp',
      autores: ['Roger S. Pressman'],
      editorial: 'McGraw-Hill Interamericana',
      fechaEdicion: new Date(2006, 6, 30),
      calificacion: 4.5,
      categorias: ['Programación', 'Desarrollo de Software'],
      formatos: ['Físico', 'Digital'],
    },
    {
      id: 7,
      isbn: '978-1493652493',
      titulo: 'Python para todos',
      descripcion:
        'Un libro introductorio que enseña programación en Python desde cero. Contiene ejemplos y ejercicios para ayudar a los lectores a comprender los conceptos básicos de la programación.',
      precio: 23990,
      imagen: 'assets/img/Libros/Python para todos.jpg',
      autores: ['Raúl González Duque'],
      editorial: 'Publicado Independientemente',
      fechaEdicion: new Date(2013, 6, 1),
      calificacion: 4.5,
      categorias: ['Programación', 'Desarrollo de Software'],
      formatos: ['Físico', 'Digital'],
    },
    {
      id: 8,
      isbn: '978-6074422744',
      titulo: 'Introducción a la Inteligencia Artificial',
      descripcion:
        'Este libro ofrece una introducción clara y accesible a la inteligencia artificial, cubriendo conceptos clave y técnicas utilizadas en el campo.',
      precio: 27990,
      imagen: 'assets/img/Libros/Introducción a la Inteligencia Artificial.jpg',
      autores: ['Wolfgang Ertel'],
      editorial: 'Thomson Learning',
      fechaEdicion: new Date(2008, 15, 3),
      calificacion: 4.2,
      categorias: ['Programación', 'Desarrollo de Software'],
      formatos: ['Físico', 'Digital'],
    },
  ];

  constructor(private datePipe: DatePipe) {}

  getLibros(): Libro[] {
    return this.libros;
  }
  getLibroById(id: number): Libro | undefined {
    // Buscar el libro por su ID en la lista de libros
    return this.libros.find((libro) => libro.id === id);
  }
}
