import { Component, OnInit, HostListener } from '@angular/core';

interface Libro {
  titulo: string;
  descripcion: string;
  precio: string;
  imagen: string; // Nueva propiedad para la imagen del libro
}

@Component({
  selector: 'app-seccion-librosrecomendados',
  templateUrl: './seccion-librosrecomendados.component.html',
  styleUrls: ['./seccion-librosrecomendados.component.css'],
})
export class SeccionLibrosrecomendadosComponent {
  libros: Libro[] = [
    {
      titulo: 'Libro 1',
      descripcion:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      precio: '$3.500',
      imagen: '../../../../assets/img/Libros/Clean Code.webp',
    },
    {
      titulo: 'Libro 2',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      precio: '$1.999',
      imagen:
        '../../../../assets/img/Libros/Introducción a la Programación Estructurada en C.jpg',
    },
    {
      titulo: 'Libro 3',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      precio: '$8.599',
      imagen: '../../../../assets/img/Libros/Learning Python.png',
    },
    {
      titulo: 'Libro 4',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      precio: '$19.899',
      imagen: '../../../../assets/img/Libros/Sistemas Operativos Modernos.webp',
    },
    {
      titulo: 'Libro 5',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      precio: '$5.099',
      imagen: '../../../../assets/img/Libros/Design Patterns.jpg',
    },
  ];
  elementoActual = 0;
  elementosPorPaso = 5;
  descripcionMaxLength: number = 60;

  moverIzquierda() {
    if (this.elementoActual > 0) {
      this.elementoActual -= this.elementosPorPaso;
    }
  }

  moverDerecha() {
    if (this.elementoActual < this.libros.length - this.elementosPorPaso) {
      this.elementoActual += this.elementosPorPaso;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Cambia el número de elementos por paso según el ancho de la pantalla
    if (window.innerWidth < 619) {
      this.elementosPorPaso = 2;
    } else if (window.innerWidth < 767) {
      this.elementosPorPaso = 3;
    } else if (window.innerWidth < 1000) {
      this.elementosPorPaso = 4;
    } else {
      this.elementosPorPaso = 5;
    }

    // Asegurarse de que el elemento actual no sea mayor al total de elementos
    if (this.elementoActual + this.elementosPorPaso > this.libros.length) {
      this.elementoActual = this.libros.length - this.elementosPorPaso;
    }
  }
}
