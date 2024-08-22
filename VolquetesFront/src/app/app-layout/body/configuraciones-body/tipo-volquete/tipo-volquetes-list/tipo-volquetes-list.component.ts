import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'

import { TipoVolqueteModel } from '../../../../../model/interfaces/tipo_volquete.interface.js';
import { TiposVolqueteService } from '../../../../../services/tiposVolqueteService/tipos-volquete.service.js';
import { TiposVolqueteBodyService } from '../tipos-volquete-body.service.js';


@Component({
  selector: 'app-tipo-volquetes-list',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './tipo-volquetes-list.component.html',
  styleUrl: './tipo-volquetes-list.component.css',
})
export class TipoVolquetesListComponent implements OnInit, OnDestroy {
  tipos: TipoVolqueteModel[] = [];
  displayedColumns: string[] = ['id_tipo_volquete','descripcion_tipo_volquete'];
  columnNames: { [key: string]: string } = {
    'id_tipo_volquete': 'ID',
    'descripcion_tipo_volquete': 'Descripción'
  };

  tipoSeleccionado: TipoVolqueteModel | null = null;

  editingRow: TipoVolqueteModel | null = null;
  editTemp: TipoVolqueteModel = { id_tipo_volquete: 0, descripcion_tipo_volquete: '' };

  private subscription = new Subscription();

  constructor(
    private tiposVolqueteService: TiposVolqueteService,
    private tiposVolqueteFormListService: TiposVolqueteBodyService
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.loadTiposVolquete();
  }

  loadTiposVolquete(): void {
    this.subscription.add(
      this.tiposVolqueteService.tiposVolquete$.subscribe((data) => {
        console.log('Data received:', data);
        this.tipos = Object.values(data);
      },(error) => {
        console.error('Error al cargar los tipos de volquete', error);
      })
    );
  }

  startEdit(tipo: TipoVolqueteModel): void {
    console.log("StartEdit called");
    this.editingRow = { ...tipo };
    this.editTemp = { ...tipo }; // Hago una copia de lo que estamos editando
  }

  saveEdit(): void {
    if (this.editTemp) {
      this.subscription.add(
        this.tiposVolqueteService.update(this.editTemp).subscribe({
          next: () => {
            this.loadTiposVolquete(); // Refresh the list
            this.editingRow = null; // Exit edit mode
          },
          error: (error) => {
            console.error('Error al actualizar el tipo de volquete', error);
          }
        })
      );
    }
  }

  cancelEdit(): void {
    this.editingRow = null; // Exit edit mode
  }

  onAdd(): void {
    this.tiposVolqueteFormListService.startAdding();
    console.log('you pressed onAddProveedor in tiposVolquete-list.component');
  }

  addTipoVolquete(tipo: TipoVolqueteModel): void {
    this.subscription.add(
      this.tiposVolqueteService.add(tipo).subscribe({
        next: (newTipo) => {
          this.tipos.push(newTipo);
        },
        error: (error) => {
          console.error('Error adding TipoVolquete:', error);
        },
      })
    );
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy called');
    this.subscription.unsubscribe(); // Clean up subscriptions
  }

  onSeleccionarTipo(tipo: TipoVolqueteModel): void {
    this.tiposVolqueteFormListService.select(tipo); /*Servicio para marcar al tipo como "Selected" */
    console.log('Row clicked:', tipo);
  }
}
