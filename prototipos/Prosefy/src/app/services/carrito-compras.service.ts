import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoComprasService {
  private librosEnCarrito: number[] = [];

  constructor() {
    this.obtenerCarritoAlmacenamientoLocal();
  }

  agregarAlCarrito(libroId: number) {
    if (!this.librosEnCarrito.includes(libroId)) {
      this.librosEnCarrito.push(libroId);
      this.actualizarAlmacenamientoLocal();
    }
  }

  eliminarDelCarrito(libroId: number) {
    const index = this.librosEnCarrito.indexOf(libroId);
    if (index !== -1) {
      this.librosEnCarrito.splice(index, 1);
      this.actualizarAlmacenamientoLocal();
    }
  }

  actualizarAlmacenamientoLocal() {
    localStorage.setItem('librosEnCarrito', JSON.stringify(this.librosEnCarrito));
  }


  getLibrosEnCarrito(): number[] {
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