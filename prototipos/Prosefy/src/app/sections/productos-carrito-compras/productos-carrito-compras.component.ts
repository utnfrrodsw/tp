import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Libro, LibrosService } from '../../services/libros.service';
import { CarritoComprasService } from '../../services/carrito-compras.service';
import { CurrencyService } from '../../services/currency.service';
import { Autor, AutoresService } from '../../services/autores.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-productos-carrito-compras',
  templateUrl: './productos-carrito-compras.component.html',
  styleUrls: ['./productos-carrito-compras.component.css']
})
export class ProductosCarritoComprasComponent implements OnInit {
  libros: Libro[] = [];
  total: number = 0;
  cantidades: { [id: string]: number } = {};
  autoresNombres: { [id: string]: string[] } = {}; // Agregamos esta variable

  constructor(
    public currencyService: CurrencyService,
    private librosService: LibrosService,
    private carritoService: CarritoComprasService,
    private autoresService: AutoresService // Inyectar el servicio AutoresService
  ) { }

  ngOnInit() {
    this.obtenerLibrosEnCarrito();
  }

  obtenerLibrosEnCarrito() {
    const librosEnCarritoIds = this.carritoService.getLibrosEnCarrito();

    this.librosService.getAll().subscribe({
      next: (response: any) => {
        const libros: Libro[] = response.data;
        if (Array.isArray(libros)) {
          this.libros = libros
            .filter(libro => librosEnCarritoIds.includes(libro._id.toString()));

          this.libros.forEach((libro) => {
            // Crear un array de IDs de autores específico para cada libro
            const idsAutores = libro.autores;

            // Crear un array de observables para las solicitudes de nombres de autores
            const observables = idsAutores.map(autorId => this.autoresService.getNombreCompleto(autorId));

            // Usar forkJoin para esperar a que todas las solicitudes se completen
            forkJoin(observables).subscribe({
              next: (nombres: (string | undefined)[]) => {
                // Asignar los nombres al arreglo autoresNombres
                this.autoresNombres[libro._id.toString()] = nombres.filter(nombre => !!nombre) as string[];
              },
              error: (error) => {
                console.error('Error obteniendo autores:', error);
              }
            });
          });

          // Después de que todas las solicitudes se completen, continuar con el resto del código
          this.cantidades = {};
          this.libros.forEach((libro) => {
            this.cantidades[libro._id.toString()] = 1;
          });
          this.calculateTotal();

        } else {
          console.error('La respuesta del servidor no es un array de libros:', response);
        }
      },
      error: (error) => {
        console.error('Error obteniendo libros:', error);
      }
    });
  }

  eliminarDelCarrito(libroId: string) {
    this.carritoService.eliminarDelCarrito(libroId);
    this.obtenerLibrosEnCarrito();
  }

  calculateTotal() {
    const maxCantidad = 10;
    const minCantidad = 1;
    this.total = this.libros.reduce((sum, libro) => sum + (libro.precio * this.cantidades[libro._id]), 0);

    for (let libro of this.libros) {
      if (this.cantidades[libro._id] > maxCantidad) {
        this.cantidades[libro._id] = maxCantidad;
      }
      if (this.cantidades[libro._id] < minCantidad) {
        this.cantidades[libro._id] = minCantidad;
      }
    }
  }

  validarCantidad(event: Event, libroId: string) {
    const inputElement = event.target as HTMLInputElement;
    let cantidad = parseInt(inputElement.value);

    if (isNaN(cantidad) || cantidad < 1) {
      inputElement.value = '1';
      this.cantidades[libroId] = 1;
    } else if (cantidad > 10) {
      inputElement.value = '10';
      this.cantidades[libroId] = 10;
    } else {
      this.cantidades[libroId] = cantidad;
    }
  }

  subTotal(libro: Libro) {
    return libro.precio * this.cantidades[libro._id];
  }

  calculatePriceInSelectedCurrency(precio: number): number {
    return this.currencyService.calculatePriceInSelectedCurrency(precio);
  }

}
