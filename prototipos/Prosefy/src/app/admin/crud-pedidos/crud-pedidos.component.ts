import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, map } from 'rxjs';
import { PedidosService } from 'src/app/services/pedido.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crud-pedidos',
  templateUrl: './crud-pedidos.component.html',
  styleUrls: ['./crud-pedidos.component.css']
})
export class CrudPedidosComponent implements OnInit {
  pedidoEditandoId: string | null = null;
  nuevoEstado: string = '';
  currentPedidoId: string | null = null;

  constructor(private pedidoService: PedidosService, private authService: AuthService) { }

  pedidosIds: string[] = [];
  pedidosData: { [key: string]: { fecha: Date | undefined, usuario: string | undefined, libro: string[] | undefined } } = {};

  ngOnInit() {
    this.pedidoService.getPedidosIds().subscribe(
      (pedidosIds: string[]) => {
        this.pedidosIds = pedidosIds;

        const requests = pedidosIds.map(id =>
          forkJoin({
            fecha: this.pedidoService.getFechaById(id),
            usuario: this.pedidoService.getUsuarioById(id),
            libro: this.pedidoService.getLibroById(id)
          }).pipe(
            map(({ fecha, usuario, libro }) => ({
              id,
              fecha: fecha ? new Date(fecha) : undefined,
              usuario: usuario,
              libro: libro
            }))
          )
        );

        forkJoin(requests).subscribe((pedidos) => {
          pedidos.forEach(pedido => {
            this.pedidosData[pedido.id] = {
              fecha: pedido.fecha,
              usuario: pedido.usuario,
              libro: pedido.libro
            };
          });
        });
      },
      (error) => {
        console.error('Error al obtener los IDs de los pedidos:', error);
      }
    );
  }

  eliminarPedido(pedidoId: string): void {

    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#242729',
      color: '#fff',
      confirmButtonColor: '#473226',
      cancelButtonColor: '#181a1b',
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedidoService.eliminarPedido(pedidoId).subscribe(
          () => {
            // Después de la eliminación exitosa, mostramos el Swal de éxito
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El pedido ha sido eliminado con éxito.',
              icon: 'success',
              background: '#242729',
              color: '#fff',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#473226',
            }).then(() => {
              // Recargar la página solo después de que el usuario haga clic en "Aceptar"
              location.reload();
            });
          },
          (error) => {
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al eliminar el pedido.',
              icon: 'error',
              background: '#242729',
              color: '#fff',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#473226',
            });
          }
        );
      }
    });
  }

  editarPedido(pedidoId: string): void {
    if (this.pedidoEditandoId === pedidoId) {
      this.pedidoService.setTipo(pedidoId, this.nuevoEstado).subscribe(
        (response: any) => {
          console.log('Estado actualizado con éxito:', response);
          window.location.reload();
        },
        (error: any) => {
          console.error('Error al actualizar el estado:', error);
        }
      );
    }

    this.pedidoEditandoId = (this.pedidoEditandoId === pedidoId) ? null : pedidoId;
    this.nuevoEstado = '';
  }
}