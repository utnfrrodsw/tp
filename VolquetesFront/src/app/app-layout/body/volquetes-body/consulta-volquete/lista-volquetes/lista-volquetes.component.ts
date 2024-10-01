import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolqueteModel } from '../../../../../../../../VolquetesFront/src/app/model/interfaces/volquete.interface.js'
import { Volquete } from '../../../../../../../../VolquetesFront/src/app/model/interfaces/volquete.interface.js';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { VolqueteService } from '../../../../../services/volqueteService/volquete.service.js';
import { TipoVolqueteModel } from '../../../../../model/interfaces/tipo_volquete.interface.js';



@Component({
  selector: 'app-lista-volquetes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lista-volquetes.component.html',
  styleUrl: './lista-volquetes.component.css',
})
export class ListaVolquetesComponent {
  @Input() volquete!: Volquete;

  volquetes: VolqueteModel[] = [];
  displayedColumns: string[] = [
    'nro_volquete',
    'tipo_volquete.descripcion_tipo_volquete',
    'marca',
    'fecha_compra',
  ];

  getColspan(): number {
    return this.displayedColumns.reduce((acc) => acc + 1, 0) + 1;
  }

  columnNames: { [key: string]: string } = {
    nro_volquete: 'Nro',
    'tipo_volquete.descripcion_tipo_volquete': 'Tipo',
    marca: 'Marca',
    fecha_compra: 'Fecha de Compra',
    estado_alquiler: 'Estado',
  };

  volqueteSeleccionado: VolqueteModel | null = null;
  deletingRow: VolqueteModel | null = null;
  editingRow: VolqueteModel | null = null;
  editTemp: VolqueteModel | null = null;

  isAddingNew: boolean = false;
  isEditing: boolean = false;

  private subscription = new Subscription();

  constructor(private volqueteService: VolqueteService) {}

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.loadVolquetes();
  }

  loadVolquetes(): void {
    this.subscription.add(
      this.volqueteService.volquetes$.subscribe(
        (data) => {
          console.log('Data received:', data);
          this.volquetes = Object.values(data);
        },
        (error) => {
          console.error('Error al cargar los volquetes', error);
        }
      )
    );
  }

  delete(volquete: VolqueteModel): void {
    console.log('delete called');

    this.isAddingNew = false;
    this.isEditing = false;

    this.deletingRow = volquete;

    this.subscription.add(
      this.volqueteService.delete(this.deletingRow.nro_volquete).subscribe({
        next: () => {
          this.loadVolquetes(); // Refresh the list
        },
        error: (error) => {
          console.error('Error al eliminar el tipo de volquete', error);
        },
      })
    );
  }

  startEdit(volquete: VolqueteModel): void {
    console.log('StartEdit called');

    this.isAddingNew = false;
    this.isEditing = true;

    this.editingRow = volquete;
    this.editTemp = { ...volquete }; // Hago una copia de lo que estamos editando
  }

  saveEdit(): void {
    if (this.editTemp) {
      if (this.isAddingNew) {
        // Si estamos en modo "Agregar"
        this.addVolquete(this.editTemp);
        this.isAddingNew = false; // Resetear el modo "Agregar"
      } else {
        if (this.isEditing) {
          // Modo "Editar"
          this.subscription.add(
            this.volqueteService.update(this.editTemp).subscribe({
              next: () => {
                this.loadVolquetes(); // Refresh the list
                this.editingRow = null; // Exit edit mode
              },
              error: (error) => {
                console.error('Error al actualizar el volquete', error);
              },
            })
          );
        }
      }
    }
  }

  cancelEdit(): void {
    this.isAddingNew = false;
    this.isEditing = false;
    this.editingRow = null; // Exit edit mode
  }

  onAdd(): void {
    const newVolquete: VolqueteModel = {
      nro_volquete: 0,
      tipo_volquete: new TipoVolqueteModel,
      fecha_compra: new Date(),
      fecha_fabricacion: new Date(),
      marca: '',
      tipo_volquete: { id_tipo_volquete: 0, descripcion_tipo_volquete: '' }
    };
    this.volquetes.push(newVolquete);
    this.startEdit(newVolquete);
    //this.tiposVolqueteFormListService.startAdding();
    this.isAddingNew = true;
    console.log('you pressed onAddProveedor in volquete-list.component');
  }

  addVolquete(tipo: VolqueteModel): void {
    this.subscription.add(
      this.volqueteService.add(tipo).subscribe({
        next: (newTipo) => {
          this.loadVolquetes();
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

  onSeleccionarTipo(tipo: VolqueteModel): void {
    //this.tiposVolqueteFormListService.select(
    tipo;
    // ); /*Servicio para marcar al tipo como "Selected" */
    console.log('Row clicked:', tipo);
  }
}
