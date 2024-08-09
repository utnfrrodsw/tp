import { Component, OnInit } from '@angular/core';
import { TipoVolqueteModel } from '../../../../model/interfaces/tipo_volquete.interface.js';
import { DatosTipoVolqueteService } from '../../../../services/datosVolqueteService/datos-tipo-volquete.service.js';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alta-tipo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tipo-volquetes-form.component.html',
  styleUrl: './tipo-volquetes-form.component.css',
})

export class AltaFormComponent implements OnInit {
  tipoVolquete: TipoVolqueteModel;
  introducido = -1;
  mensajeErr = '';

  tipoVolqueteForm: FormGroup = new FormGroup({
    id: new FormControl({ value:'', diabled:true}),
    descripcion: new FormControl({ value:'', diabled:true})
  })


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

insertar(): void{
  const tipoVolquete: TipoVolqueteModel = {
    id: Number(this.tipoVolqueteForm.value.id ?? 0), // or generate a new ID
    descripcion: this.tipoVolqueteForm.value.descripcion ?? ''
  };
  this.tipoVolqueteService.addTipo(newTipoVolquete).subscribe((tipoVolquete)=>{
    console.log('Proveedor agregado:' , tipoVolquete);
    this.resetForm();
  });

}

eliminar(): void{

}




  private resetForm(): void {
    this.tipoVolqueteForm.setValue({
      id:'',
      nombre:'',
      anchoBobinas:''});
    this.isAddingProveedor = true;
    this.deshabilitarEdicion();
  }

}