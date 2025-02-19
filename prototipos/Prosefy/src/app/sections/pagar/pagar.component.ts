import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Libro, LibrosService } from '../../services/libros.service';
import { CarritoComprasService } from '../../services/carrito-compras.service';
import { PedidosService, Pedido } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { AutoresService } from '../../services/autores.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pagar',
  templateUrl: './pagar.component.html',
  styleUrls: ['./pagar.component.css'],
})
export class PagarComponent implements OnInit {
  envio: number = 0;
  subtotal: number = 0;
  contador = 1;
  libros: Libro[] = [];
  total: number = 0;
  cantidades: { [id: string]: number } = {};
  mostrarLabel: boolean = true;
  noMostrarlabel: boolean = false;
  autoresNombres: { [id: string]: string[] } = {};
  metodoSeleccionado: string | null = null;
  usuarioId: string | null = null; // ID del usuario logueado

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.actualizarVisibilidadLabel();
  }

  constructor(
    private librosService: LibrosService,
    private carritoService: CarritoComprasService,
    private autoresService: AutoresService,
    private pedidosService: PedidosService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.actualizarVisibilidadLabel();
    this.obtenerLibrosEnCarrito();
    this.libros.forEach((libro) => {
      this.cantidades[libro._id] = 1;
    });
    this.calculateTotal();
    this.subTotal();

    // Obtener el ID del usuario logueado
    this.usuarioId = this.authService.getCurrentUserId();

    if (!this.usuarioId) {
      console.error('Usuario no logueado');
      // Redirigir al usuario a la página de inicio de sesión
      this.authService.cerrarSesion();
    }
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
            const idsAutores = libro.autores;
            const observables = idsAutores.map(autorId => this.autoresService.getNombreCompleto(autorId));

            forkJoin(observables).subscribe({
              next: (nombres: (string | undefined)[]) => {
                this.autoresNombres[libro._id.toString()] = nombres.filter(nombre => !!nombre) as string[];
              },
              error: (error) => {
                console.error('Error obteniendo autores:', error);
              }
            });
          });

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
    if (this.total < 10000) {
      this.envio = 3000;
    }
    if (this.contador == 1) {
      this.total += 0;
    } else if (this.contador == 2) {
      this.total += 2000;
    } else if (this.contador == 3) {
      this.total += 3000;
    }
    this.total += this.envio;
    this.envio = 0;
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

  subTotal() {
    const maxCantidad = 10;
    const minCantidad = 1;
    this.subtotal = this.libros.reduce((sum, libro) => sum + (libro.precio * this.cantidades[libro._id]), 0);

    for (let libro of this.libros) {
      if (this.cantidades[libro._id] > maxCantidad) {
        this.cantidades[libro._id] = maxCantidad;
      }
      if (this.cantidades[libro._id] < minCantidad) {
        this.cantidades[libro._id] = minCantidad;
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

  seleccionarMetodoPago(metodo: string) {
    if (this.metodoSeleccionado === metodo) {
      this.metodoSeleccionado = null;
    } else {
      this.metodoSeleccionado = metodo;
    }
    console.log('Método de pago seleccionado:', this.metodoSeleccionado);
  }

  crearPedido(): void {
    if (!this.usuarioId) {
      console.error('Usuario no logueado');
      return;
    }

    if (this.libros.length === 0) {
      console.error('No hay libros en el carrito');
      return;
    }

    const nuevoPedido: Pedido = {
      fecha: new Date().toISOString(), // Fecha actual
      usuario: this.usuarioId, // ID del usuario logueado
      libro: this.libros.map(libro => libro._id), // IDs de los libros en el carrito
    };

    this.pedidosService.crearPedido(nuevoPedido).subscribe({
      next: (response: any) => {
        console.log('Pedido creado con éxito:', response); // Limpiar el carrito después de crear el pedido
        this.carritoService.limpiarCarrito();
        this.router.navigate(['/pedidos']);
      },
      error: (error) => {
        console.error('Error al crear el pedido:', error);
      },
    });
  }

  private actualizarVisibilidadLabel() {
    this.mostrarLabel = window.innerWidth > 500;
    this.noMostrarlabel = !this.mostrarLabel;
  }
}