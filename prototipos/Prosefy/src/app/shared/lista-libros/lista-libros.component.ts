import { Component, OnInit, HostListener } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';

// Definir una interfaz para representar la estructura de un libro
interface Libro {
  titulo: string;
  descripcion: string;
  precio: number; // Cambia el tipo a number para poder hacer operaciones con el precio
  imagen: string;
}

@Component({
  selector: 'app-lista-libros',
  templateUrl: './lista-libros.component.html',
  styleUrls: ['./lista-libros.component.css'],
})
export class ListaLibrosComponent {
  elementosAlInicio: boolean = true;
  elementosAlFinal: boolean = false;
  // Lista de libros con información
  libros: Libro[] = [
    {
      titulo: 'Libro 1',
      descripcion:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      precio: 3500,
      imagen: '../../../../assets/img/Libros/Clean Code.webp',
    },
    {
      titulo: 'Libro 2',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      precio: 1999,
      imagen:
        '../../../../assets/img/Libros/Introducción a la Programación Estructurada en C.jpg',
    },
    {
      titulo: 'Libro 3',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      precio: 8599,
      imagen: '../../../../assets/img/Libros/Learning Python.png',
    },
    {
      titulo: 'Libro 4',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      precio: 19899,
      imagen: '../../../../assets/img/Libros/Sistemas Operativos Modernos.webp',
    },
    {
      titulo: 'Libro 5',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      precio: 5099,
      imagen: '../../../../assets/img/Libros/Design Patterns.jpg',
    },
  ];
  // Índice del elemento actual en la lista de libros
  elementoActual = 0;
  // Número de elementos a mostrar por paso
  elementosPorPaso = 5;
  // Longitud máxima de la descripción de un libro
  descripcionMaxLength: number = 60;

  constructor(public currencyService: CurrencyService) {}

  // Método para mover la lista de libros hacia la izquierda
  moverIzquierda() {
    if (this.elementoActual > 0) {
      this.elementoActual -= this.elementosPorPaso;
    }
    this.elementosAlFinal = false;
    this.elementosAlInicio = this.elementoActual === 0;
  }

  // Método para mover la lista de libros hacia la derecha
  moverDerecha() {
    if (this.elementoActual < this.libros.length - this.elementosPorPaso) {
      this.elementoActual += this.elementosPorPaso;
    }
    this.elementosAlInicio = false;
    this.elementosAlFinal =
      this.elementoActual + this.elementosPorPaso >= this.libros.length;
  }

  // Escuchar el evento de redimensionamiento de la ventana
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Cambia el número de elementos por paso según el ancho de la pantalla
    if (window.innerWidth < 450) {
      // Para pantallas demasiado pequeñas muestra y avanza de a 1 elemento (esto es para que no se "corte" el segundo libro)
      this.elementosPorPaso = 1;
    } else if (window.innerWidth < 619) {
      // Para pantallas pequeñas muestra y avanza de a 2 elementos
      this.elementosPorPaso = 2;
    } else if (window.innerWidth < 767) {
      // Para pantallas medianas (tablets por lo general) muestra y avanza de a 3 elementos
      this.elementosPorPaso = 3;
    } else if (window.innerWidth < 1000) {
      // Para pantallas más grandes muestra y avanza de a 4 o 5 elementos
      this.elementosPorPaso = 4;
    } else {
      this.elementosPorPaso = 5;
    }

    // Asegurarse de que el elemento actual no sea mayor al total de elementos
    if (this.elementoActual + this.elementosPorPaso > this.libros.length) {
      this.elementoActual = this.libros.length - this.elementosPorPaso;
    }
  }

  calculatePriceInSelectedCurrency(precio: number): number {
    return this.currencyService.calculatePriceInSelectedCurrency(precio);
  }
}
