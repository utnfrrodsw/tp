import { Component, OnInit, HostListener } from '@angular/core';

// Definir una interfaz para representar la estructura de un autor
interface Autor {
  nombreCompleto: string;
  perfil: string;
}

@Component({
  selector: 'app-autores-populares',
  templateUrl: './autores-populares.component.html',
  styleUrls: ['./autores-populares.component.css'],
})
export class AutoresPopularesComponent {
  elementosAlInicio: boolean = false;
  elementosAlFinal: boolean = false;
  // Lista de autores con información
  autores: Autor[] = [
    {
      nombreCompleto: 'Robert C. Martin',
      perfil: '../../../../assets/img/Autores/Robert C. Martin.jpg',
    },
    {
      nombreCompleto: 'James Clear',
      perfil: '../../../../assets/img/Autores/James Clear.png',
    },
    {
      nombreCompleto: 'Autor 3',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
    {
      nombreCompleto: 'Autor 4',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
    {
      nombreCompleto: 'Autor 5',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
    {
      nombreCompleto: 'Autor 6',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
    {
      nombreCompleto: 'Autor 7',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
    {
      nombreCompleto: 'Autor 8',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
    {
      nombreCompleto: 'Autor 9',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
    {
      nombreCompleto: 'Autor 10',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
    {
      nombreCompleto: 'Autor 11',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
    {
      nombreCompleto: 'Autor 12',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
    {
      nombreCompleto: 'Autor 13',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
    {
      nombreCompleto: 'Autor 14',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
    {
      nombreCompleto: 'Autor 15',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
    {
      nombreCompleto: 'Autor 16',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
  ];
  // Índice del elemento actual en la lista de autores
  elementoActual = 0;
  // Número de elementos a mostrar por paso
  elementosPorPaso = 8;

  // Método para mover la lista de autores hacia la izquierda
  moverIzquierda() {
    if (this.elementoActual > 0) {
      this.elementoActual -= this.elementosPorPaso;
    }
    this.elementosAlFinal = false;
    this.elementosAlInicio = this.elementoActual === 0;
  }

  // Método para mover la lista de autores hacia la derecha
  moverDerecha() {
    if (this.elementoActual < this.autores.length - this.elementosPorPaso) {
      this.elementoActual += this.elementosPorPaso;
    }
    this.elementosAlInicio = false;
    this.elementosAlFinal =
      this.elementoActual + this.elementosPorPaso >= this.autores.length;
  }

  // Escuchar el evento de redimensionamiento de la ventana
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Cambia el número de elementos por paso según el ancho de la pantalla
    if (window.innerWidth < 550) {
      // Para pantallas demasiado pequeñas muestra y avanza de a 2 elementos
      this.elementosPorPaso = 2;
    } else if (window.innerWidth < 768) {
      // Para pantallas pequeñas muestra y avanza de a 4 elementos
      this.elementosPorPaso = 4;
    } else if (window.innerWidth < 1000) {
      // Para pantallas más grandes muestra y avanza de a 6 o 8 elementos
      this.elementosPorPaso = 6;
    } else {
      this.elementosPorPaso = 8;
    }

    // Asegurarse de que el elemento actual no sea mayor al total de elementos
    if (this.elementoActual + this.elementosPorPaso > this.autores.length) {
      this.elementoActual = this.autores.length - this.elementosPorPaso;
    }
  }
}
