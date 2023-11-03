import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Libro, LibrosService } from '../../services/libros.service';
import { CarritoComprasService } from '../../services/carrito-compras.service';

@Component({
  selector: 'app-productos-carrito-compras',
  templateUrl: './productos-carrito-compras.component.html',
  styleUrls: ['./productos-carrito-compras.component.css']
})
export class ProductosCarritoComprasComponent implements OnInit {
  libros: Libro[] = [];
  total: number = 0;
  cantidades: { [id: number]: number } = {};

  constructor(
    private librosService: LibrosService,
    private carritoService: CarritoComprasService
  ) { }

  ngOnInit() {
    this.obtenerLibrosEnCarrito();
    this.libros.forEach((libro) => {
      this.cantidades[libro.id] = 1; // Inicializando las cantidades en 1 por defecto
    });
    this.calculateTotal(); // Calcular el total inicial
  }

  obtenerLibrosEnCarrito() {
    const librosEnCarritoIds = this.carritoService.getLibrosEnCarrito();
    this.libros = this.librosService.getLibros()
      .filter(libro => librosEnCarritoIds.includes(libro.id));
    this.calculateTotal();
  }


  eliminarDelCarrito(libroId: number) {
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

  validarCantidad(event: Event, libroId: number) {
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
}