import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaVolquetesComponent } from './lista-volquetes/lista-volquetes.component.js';
import { Volquete } from '../../../../../../../VolquetesFront/src/app/model/interfaces/volquete.interface.js';


@Component({
  selector: 'app-consulta-volquete',
  standalone: true,
  imports: [CommonModule, ListaVolquetesComponent],
  templateUrl: './consulta-volquete.component.html',
  styleUrl: './consulta-volquete.component.css',
})
export class ConsultaVolqueteComponent {
  listaVolquetes: Volquete[] = [
    {
      nro: 0,
      tipo_volquete: { id: 1, descripcion: 'Chico' },
      fecha_compra: new Date(),
      fecha_fabricacion: new Date('2024-01-01'),
      marca: 'Sarasa',
    },
    {
      nro: 1,
      tipo_volquete: { id: 2, descripcion: 'Mediano' },
      fecha_compra: new Date(),
      fecha_fabricacion: new Date('2024-01-01'),
      marca: 'Sarasa',
    },
    {
      nro: 2,
      tipo_volquete: { id: 3, descripcion: 'Grande' },
      fecha_compra: new Date(),
      fecha_fabricacion: new Date('2024-01-01'),
      marca: 'Sarasa',
    },
    {
      nro: 3,
      tipo_volquete: { id: 1, descripcion: 'Chico' },
      fecha_compra: new Date(),
      fecha_fabricacion: new Date('2024-01-01'),
      marca: 'Sarasa',
    },
  ];
}
