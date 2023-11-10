import { Component, OnInit, HostListener } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { Libro, LibrosService } from '../../services/libros.service';
import { forkJoin, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-lista-libros',
  templateUrl: './lista-libros.component.html',
  styleUrls: ['./lista-libros.component.css'],
})
export class ListaLibrosComponent implements OnInit {
  elementosAlInicio: boolean = true;
  elementosAlFinal: boolean = false;
  librosIds: string[] = [];
  librosData: {
    [key: string]: {
      titulo: string | undefined,
      descripcion: string | undefined,
      precio: number | undefined,
      portada: string | undefined,
    }
  } = {};
  librosAMostrar: any = [];

  // Índice del elemento actual en la lista de libros
  elementoActual = 0;
  // Número de elementos a mostrar por paso
  elementosPorPaso = 5;
  // Longitud máxima de la descripción de un libro
  descripcionMaxLength: number = 60;


  constructor(
    public currencyService: CurrencyService,
    private librosService: LibrosService
  ) { }

  ngOnInit() {
    this.librosService.getLibrosIds().subscribe((librosIds: string[]) => {
      console.log("Libros Ids: ", librosIds); // Verifica que los Ids se estén cargando correctamente
      this.librosIds = librosIds;

      const requests = librosIds.map(id =>
        forkJoin({
          titulo: this.librosService.getTitulo(id),
          descripcion: this.librosService.getDescripcion(id),
          precio: this.librosService.getPrecio(id),
          portada: this.librosService.getPortada(id)
        }).pipe(map(({ titulo, descripcion, precio, portada }) => ({ id, titulo, descripcion, precio, portada })))
      );

      forkJoin(requests).subscribe((libros) => {
        console.log("Libros Data: ", libros); // Verifica que los datos de los libros se estén cargando correctamente
        libros.forEach(libro => {
          this.librosData[libro.id] = { titulo: libro.titulo, descripcion: libro.descripcion, precio: libro.precio, portada: libro.portada };
        });

        this.actualizarLibrosAMostrar();
      });
    });
  }

  moverIzquierda() {
    if (this.elementoActual > 0) {
      this.elementoActual -= this.elementosPorPaso;
      this.actualizarLibrosAMostrar();
    }
    this.elementosAlFinal = false;
    this.elementosAlInicio = this.elementoActual === 0;
  }

  moverDerecha() {
    if (this.elementoActual < this.librosIds.length - this.elementosPorPaso) {
      this.elementoActual += this.elementosPorPaso;
      this.actualizarLibrosAMostrar();
    }
    this.elementosAlInicio = false;
    this.elementosAlFinal = this.elementoActual + this.elementosPorPaso >= this.librosIds.length;
  }

  actualizarLibrosAMostrar() {
    const fin = Math.min(this.elementoActual + this.elementosPorPaso, this.librosIds.length);
    this.librosAMostrar = this.librosIds.slice(this.elementoActual, fin)
      .map(id => this.librosData[id]);
  }

  // Escuchar el evento de redimensionamiento de la ventana
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Cambia el número de elementos por paso según el ancho de la pantalla
    if (window.innerWidth < 619) {
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
    if (this.elementoActual + this.elementosPorPaso > (this.librosIds.length || 0)) {
      this.elementoActual = (this.librosIds.length || 0) - this.elementosPorPaso;
    }
    this.actualizarLibrosAMostrar();
  }

  calculatePriceInSelectedCurrency(precio: number): number {
    return this.currencyService.calculatePriceInSelectedCurrency(precio);
  }

  calcularAlturaImagen(): number {
    // Definir la altura deseada, por ejemplo, 200 píxeles
    const alturaDeseada = 350;

    // Devuelve la altura deseada
    return alturaDeseada;
  }
}
