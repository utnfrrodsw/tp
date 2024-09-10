import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { UsuarioModel } from '../../../../model/interfaces/usuario.interface.js';

@Injectable({
  providedIn: 'root',
})
export class UsuariosBodyService {
  private isAddingSubject = new BehaviorSubject<boolean>(false);
  isAdding$ = this.isAddingSubject.asObservable();

  private isEditModeSubject = new BehaviorSubject<boolean>(false);
  isEditMode$ = this.isEditModeSubject.asObservable();

  private selected = new BehaviorSubject<UsuarioModel | null>(null);
  selectedUsuario$ = this.selected.asObservable();

  startAdding() {
    this.clearSelected();
    this.isAddingSubject.next(true);
  }

  stopAdding() {
    this.isAddingSubject.next(false);
  }

  startEditing() {
    this.isEditModeSubject.next(true);
    this.isAddingSubject.next(false);
  }

  stopEditing() {
    this.isEditModeSubject.next(false);
  }

  select(tipo: UsuarioModel) {
    this.selected.next(tipo);
  }

  clearSelected() {
    this.selected.next(null);
    this.stopEditing;
  }
}
