import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Libro, LibrosService } from '../../services/libros.service';
import { CarritoComprasService } from '../../services/carrito-compras.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-productos-carrito-compras',
  templateUrl: './productos-carrito-compras.component.html',
  styleUrls: ['./productos-carrito-compras.component.css']
})
export class ProductosCarritoComprasComponent implements OnInit {
  libros: Libro[] = [];
  total: number = 0;
  cantidades: { [id: string]: number } = {};

  constructor(
    public currencyService: CurrencyService,
    private librosService: LibrosService,
    private carritoService: CarritoComprasService
  ) { }

  ngOnInit() {
    this.obtenerLibrosEnCarrito();
  }

  obtenerLibrosEnCarrito() {
    const librosEnCarritoIds = this.carritoService.getLibrosEnCarrito();

    this.librosService.getAll().subscribe(
      (libros: Libro[]) => {
        this.libros = libros.filter(libro => librosEnCarritoIds.includes(libro.id.toString()));
        this.cantidades = {};
        this.libros.forEach((libro) => {
          this.cantidades[libro.id.toString()] = 1; // Inicializar las cantidades en 1 por defecto
        });
        this.calculateTotal();
      },
      (error) => {
        console.error('Error obteniendo libros:', error);
      }
    );
  }

  eliminarDelCarrito(libroId: string) {
    this.carritoService.eliminarDelCarrito(libroId);
    this.obtenerLibrosEnCarrito();
  }

  calculateTotal() {
    const maxCantidad = 10;
    const minCantidad = 1;
    this.total = this.libros.reduce((sum, libro) => sum + (libro.precio * this.cantidades[libro.id]), 0);

    for (let libro of this.libros) {
      if (this.cantidades[libro.id] > maxCantidad) {
        this.cantidades[libro.id] = maxCantidad;
      }
      if (this.cantidades[libro.id] < minCantidad) {
        this.cantidades[libro.id] = minCantidad;
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
    return libro.precio * this.cantidades[libro.id];
  }

  calculatePriceInSelectedCurrency(precio: number): number {
    return this.currencyService.calculatePriceInSelectedCurrency(precio);
  }

}