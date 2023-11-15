import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoComprasService {
  private librosEnCarrito: string[] = [];

  constructor() {
    this.obtenerCarritoAlmacenamientoLocal();
  }

  agregarAlCarrito(libroId: number) {
    const libroIdString = libroId.toString();
    if (!this.librosEnCarrito.includes(libroIdString)) {
      this.librosEnCarrito.push(libroIdString);
      this.actualizarAlmacenamientoLocal();
    }
  }

  eliminarDelCarrito(libroId: number) {
    const libroIdString = libroId.toString();
    const index = this.librosEnCarrito.indexOf(libroIdString);
    if (index !== -1) {
      this.librosEnCarrito.splice(index, 1);
      this.actualizarAlmacenamientoLocal();
    }
  }

  actualizarAlmacenamientoLocal() {
    localStorage.setItem('librosEnCarrito', JSON.stringify(this.librosEnCarrito));
  }


  getLibrosEnCarrito(): number[] {
    return this.librosEnCarrito.map(libroIdString => +libroIdString);
  }

  limpiarCarrito() {
    this.librosEnCarrito = [];
    this.actualizarAlmacenamientoLocal();
  }

  obtenerCarritoAlmacenamientoLocal() {
    const carrito = localStorage.getItem('librosEnCarrito');
    if (carrito) {
      this.librosEnCarrito = JSON.parse(carrito);
    }
  }
}