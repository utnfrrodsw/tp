import { Component, OnDestroy, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoVolqueteModel } from '../../../../../model/interfaces/tipo_volquete.interface.js';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatosTipoVolqueteService } from '../../../../../services/datosVolqueteService/datos-tipo-volquete.service.js';

@Component({
  selector: 'app-alta-tipo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tipo-volquetes-form.component.html',
  styleUrl: './tipo-volquetes-form.component.css',
})

export class TipoVolqueteFormComponent implements OnInit {
  @Input() selectedTipoVolquete: TipoVolqueteModel | null = null;
  @Input() isAddingTipoVolquete = false;

  isEditMode: boolean = false;

  route: ActivatedRoute = inject(ActivatedRoute);

  tipoVolquete: TipoVolqueteModel;
  tiposVolquetes: TipoVolqueteModel[]=[];
  
  displayedColumns: string[]=['id_tipo_volquete','descripcion_tipo_volquete'];
  
  introducido = -1;
  mensajeErr = '';

  tipoVolqueteForm: FormGroup = new FormGroup({
    id: new FormControl({ value:'', diabled:true}),
    descripcion: new FormControl({ value:'', diabled:true})
  })

  btnStateEditar:boolean = false;
  btnStateAgregar:boolean = false;
  btnStateEliminar:boolean = false;
  btnStateCancelar:boolean = false;

  constructor(private _datos: DatosTipoVolqueteService) {
    this.tipoVolquete = new TipoVolqueteModel();
  }

  ngOnInit() {}

  onSubmit() {
    this._datos.introducirTipoVolquete(this.tipoVolquete).subscribe(
      (resp) => {
        this.mensajeErr = '';
        this.introducido = 1;
        this.tipoVolquete.id_tipo_volquete = 0;
        this.tipoVolquete.descripcion_tipo_volquete = '';
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
  const newTipoVolquete: TipoVolqueteModel = {
    id_tipo_volquete: Number(this.tipoVolqueteForm.value.id ?? 0), // or generate a new ID
    descripcion_tipo_volquete: this.tipoVolqueteForm.value.descripcion ?? '',
  };
  
  this._datos.introducirTipoVolquete(newTipoVolquete).subscribe((tipoVolquete)=>{
    console.log('Tipo agregado:' , tipoVolquete);
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
  this.isAddingTipoVolquete = true;
  this.deshabilitarEdicion();
}

private deshabilitarEdicion():void{
  this.isEditMode = false;
  this.tipoVolqueteForm.get('id_tipo_volquete ')?.disable();
  this.tipoVolqueteForm.get('descripcion_tipo_volquete ')?.disable();
}



}