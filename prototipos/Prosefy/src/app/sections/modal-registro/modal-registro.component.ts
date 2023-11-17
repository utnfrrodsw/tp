import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-registro',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">Resultado del Registro</h4>
      <button type="button" class="close" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>{{ mensajeRegistro }}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="bsModalRef.hide()">Cerrar</button>
    </div>
  `
})

export class ModalRegistroComponent {
  mensajeRegistro: string = '';

  constructor(public bsModalRef: BsModalRef) { }
}