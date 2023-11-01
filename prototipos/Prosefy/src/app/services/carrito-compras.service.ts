import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoComprasService {
  librosEnCarrito: number[] = [];

  agregarAlCarrito(libroId: number) {
    this.librosEnCarrito.push(libroId);
  }

  obtenerLibrosEnCarrito(): number[] {
    return this.librosEnCarrito;
  }

  limpiarCarrito() {
    this.librosEnCarrito = [];
  }
}