import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoComprasService } from '../../services/carrito-compras.service';
import { PedidosService, Pedido } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-resumen-pedido',
  templateUrl: './resumen-pedido.component.html',
  styleUrls: ['./resumen-pedido.component.css'],
})
export class ResumenPedidoComponent implements OnInit {
  librosEnCarrito: string[] = []; // IDs de los libros en el carrito
  usuarioId: string | null = null; // ID del usuario logueado

  constructor(
    private carritoService: CarritoComprasService,
    private pedidosService: PedidosService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}
    
}