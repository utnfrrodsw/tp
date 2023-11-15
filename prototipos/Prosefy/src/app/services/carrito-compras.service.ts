import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoComprasService {
  private librosEnCarrito: string[] = [];

  constructor() {
    this.obtenerCarritoAlmacenamientoLocal();
  }

  agregarAlCarrito(libroId: string) {
    if (!this.librosEnCarrito.includes(libroId)) {
      this.librosEnCarrito.push(libroId);
      this.actualizarAlmacenamientoLocal();
    }
  }

  eliminarDelCarrito(libroId: string) {
    const index = this.librosEnCarrito.indexOf(libroId);
    if (index !== -1) {
      this.librosEnCarrito.splice(index, 1);
      this.actualizarAlmacenamientoLocal();
    }
  }

  actualizarAlmacenamientoLocal() {
    localStorage.setItem('librosEnCarrito', JSON.stringify(this.librosEnCarrito));
  }

  getLibrosEnCarrito(): string[] {
    return this.librosEnCarrito;
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
