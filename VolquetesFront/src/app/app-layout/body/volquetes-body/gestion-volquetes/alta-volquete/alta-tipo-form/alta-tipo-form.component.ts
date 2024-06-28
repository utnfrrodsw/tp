import { Component, OnInit } from '@angular/core';
import { DatosTipoVolqueteService } from '../../../../../../services/datosVolqueteService/datos-tipo-volquete.service.js';
import { TipoVolqueteModel } from '../../../../../../model/tipo_volquete.interface.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alta-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alta-tipo-form.component.html',
  styleUrl: './alta-tipo-form.component.css',
})
export class AltaFormComponent implements OnInit {
  tipoVolquete: TipoVolqueteModel;
  introducido = -1;
  mensajeErr = '';

  constructor(private _datos: DatosTipoVolqueteService) {
    this.tipoVolquete = new TipoVolqueteModel();
  }

  ngOnInit() {}
  onSubmit() {
    this._datos.introducirTipoVolquete(this.tipoVolquete).subscribe(
      (resp) => {
        this.mensajeErr = '';
        this.introducido = 1;
        this.tipoVolquete.id = 0;
        this.tipoVolquete.descripcion = '';
      },
      (error) => {
        this.introducido = 0;
        this.mensajeErr = '';
        if (error instanceof ErrorEvent) {
          this.mensajeErr = error.error.message;
        } else if (error.status == 409) {
          this.introducido = 0;
          this.mensajeErr = 'Tipo ya existe';
        } else {
          this.mensajeErr = 'Error status: ' + error.status;
        }
      }
    );
  }
}
