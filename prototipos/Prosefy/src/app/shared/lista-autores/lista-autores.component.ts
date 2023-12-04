import { Component, OnInit, HostListener } from '@angular/core';
import { AutoresService, Autor } from '../../services/autores.service';
import { forkJoin, map, switchMap } from 'rxjs';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-lista-autores',
  templateUrl: './lista-autores.component.html',
  styleUrls: ['./lista-autores.component.css']
})
export class ListaAutoresComponent implements OnInit {

  elementosAlInicio: boolean = true;
  elementosAlFinal: boolean = false;
  autoresIds: string[] = [];
  autoresData: { [key: string]: { nombreCompleto: string | undefined, perfil: string | undefined } } = {};
  autoresAMostrar: any = [];

  // Índice del elemento actual en la lista de autores
  elementoActual = 0;
  // Número de elementos a mostrar por paso
  elementosPorPaso = 8;

  constructor(private autoresService: AutoresService) { }

  ngOnInit() {
    this.autoresService.getAutoresIds().subscribe((autoresIds: string[]) => {
      this.autoresIds = autoresIds;

      const requests = autoresIds.map(id =>
        forkJoin({
          nombreCompleto: this.autoresService.getNombreCompleto(id),
          perfil: this.autoresService.getPerfil(id)
        }).pipe(map(({ nombreCompleto, perfil }) => ({ id, nombreCompleto, perfil })))
      );

      forkJoin(requests).subscribe((autores) => {
        autores.forEach(autor => {
          this.autoresData[autor.id] = { nombreCompleto: autor.nombreCompleto, perfil: autor.perfil };
        });

        this.actualizarAutoresAMostrar();
      });
    });
  }


  moverIzquierda() {
    if (this.elementoActual > 0) {
      this.elementoActual -= this.elementosPorPaso;
      this.actualizarAutoresAMostrar();
    }
    this.elementosAlFinal = false;
    this.elementosAlInicio = this.elementoActual === 0;
  }

  moverDerecha() {
    if (this.elementoActual < this.autoresIds.length - this.elementosPorPaso) {
      this.elementoActual += this.elementosPorPaso;
      this.actualizarAutoresAMostrar();
    }
    this.elementosAlInicio = false;
    this.elementosAlFinal = this.elementoActual + this.elementosPorPaso >= this.autoresIds.length;
  }

  actualizarAutoresAMostrar() {
    const fin = Math.min(this.elementoActual + this.elementosPorPaso, this.autoresIds.length);
    this.autoresAMostrar = this.autoresIds.slice(this.elementoActual, fin)
      .map(id => this.autoresData[id]);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth < 550) {
      this.elementosPorPaso = 2;
    } else if (window.innerWidth < 768) {
      this.elementosPorPaso = 4;
    } else if (window.innerWidth < 1000) {
      this.elementosPorPaso = 6;
    } else {
      this.elementosPorPaso = 8;
    }

    if (this.elementoActual + this.elementosPorPaso > this.autoresIds.length) {
      this.elementoActual = this.autoresIds.length - this.elementosPorPaso;
    }
    this.actualizarAutoresAMostrar();
  }

  formatNombreCompleto(nombreCompleto: string | undefined) {
    if (!nombreCompleto) {
      return '';
    }

    const firstSpaceIndex = nombreCompleto.indexOf(' ');
    if (firstSpaceIndex > 0) {
      const firstPart = nombreCompleto.substr(0, firstSpaceIndex);
      const secondPart = nombreCompleto.substr(firstSpaceIndex + 1);
      return `${firstPart}<br>${secondPart}`;
    } else {
      return nombreCompleto;
    }
  }
}