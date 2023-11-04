import { Component, Input, Output, EventEmitter, OnInit  } from '@angular/core';
import { Libro, LibrosService } from '../../services/libros.service';
import { CarritoComprasService } from '../../services/carrito-compras.service';

@Component({
  selector: 'app-pagar',
  templateUrl: './pagar.component.html',
  styleUrls: ['./pagar.component.css']
})
export class PagarComponent implements OnInit {
  subtotal: number = 0;
  contador = 1;
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
      this.cantidades[libro.id] = 1;
    });
    this.calculateTotal();
    this.subTotal();
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
    const envio = 500;
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

    if (this.contador ==1) {
      this.total += 0
    }
    else if (this.contador ==2) {
      this.total += 2.000
    }
    else if (this.contador ==3) {
      this.total += 3.000
    }
    this.total += envio
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

  subTotal() {
    const maxCantidad = 10;
    const minCantidad = 1;
    this.subtotal = this.libros.reduce((sum, libro) => sum + (libro.precio * this.cantidades[libro.id]), 0);

    for (let libro of this.libros) {
      if (this.cantidades[libro.id] > maxCantidad) {
        this.cantidades[libro.id] = maxCantidad;
      }
      if (this.cantidades[libro.id] < minCantidad) {
        this.cantidades[libro.id] = minCantidad;
      }
    }
  }

  
  aumentarContador() {
    if (this.contador < 3) {
      this.contador++;
    }
  }

  disminuirContador() {
    if (this.contador > 1) {
      this.contador--;
    }
  }
  
  divStyles: any = {
    'background-color': 'white'
  };

  changeBackgroundColor() {
    // Cambia el color de fondo al hacer click, o no.
    this.divStyles['background-color'] = 'lightblue'
  };

}
