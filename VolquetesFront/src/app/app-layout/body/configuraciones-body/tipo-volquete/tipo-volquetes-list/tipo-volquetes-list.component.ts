import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

import { TipoVolqueteModel } from '../../../../../model/interfaces/tipo_volquete.interface.js';
import { TiposVolqueteService } from '../../../../../services/tiposVolqueteService/tipos-volquete.service.js';
import { TiposVolqueteBodyService } from '../tipos-volquete-body.service.js';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tipo-volquetes-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tipo-volquetes-list.component.html',
  styleUrl: './tipo-volquetes-list.component.css',
})
export class TipoVolquetesListComponent {
  tipos: TipoVolqueteModel[] = [];
  
  displayedColumns: string[] = [
    'id_tipo_volquete',
    'descripcion_tipo_volquete',
  ];

  tipoSeleccionado: TipoVolqueteModel | null = null;

  private tiposVolqueteServiceSuscription: Subscription | null = null;
  private tiposVolqueteListServiceSuscription: Subscription | null = null;

  constructor(
    private tiposVolqueteService: TiposVolqueteService,
    private tiposVolqueteFormListService: TiposVolqueteBodyService
  ) {}

  ngOnInit(): void {
    this.loadTiposVolquete();
  }

  loadTiposVolquete(): void {
    this.tiposVolqueteService.getAll().subscribe((data) => {
      this.tipos = data;
    });
  }

  onSeleccionarTipo(tipo: TipoVolqueteModel): void {
    this.tiposVolqueteFormListService.select(
      tipo
    ); /*Servicio para marcar al tipo como "Selected" */
    console.log('Row clicked:', tipo);
  }

  onAdd(): void {
    /* this.isAddingProveedor=true; */
    /* this.addProveedor.emit();    */
    this.tiposVolqueteFormListService.startAdding();
    console.log('you pressed onAddProveedor in tiposVolquete-list.component');
  }

  addTipoVolquete(tipo: TipoVolqueteModel): void {
    this.tiposVolqueteService.add(tipo).subscribe({
      next: (newTipo) => {
        this.tipos.push(newTipo);
      },
      error: (error) => {
        console.error('Error adding TipoVolquete:', error);
      },
    });
  }

  
}
