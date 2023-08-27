import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-seccion-librosrecomendados',
  templateUrl: './seccion-librosrecomendados.component.html',
  styleUrls: ['./seccion-librosrecomendados.component.css'],
})
export class SeccionLibrosrecomendadosComponent {
  libros = [
    'Libro 1',
    'Libro 2',
    'Libro 3',
    'Libro 4',
    'Libro 5',
    'Libro 6',
    'Libro 7',
    'Libro 8',
    'Libro 9',
    'Libro 10',
  ];
  elementoActual = 0;
  elementosPorPaso = 5;

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
