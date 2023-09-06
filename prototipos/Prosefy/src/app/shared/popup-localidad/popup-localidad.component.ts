import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup-localidad',
  templateUrl: './popup-localidad.component.html',
  styleUrls: ['./popup-localidad.component.css'],
})
export class PopupLocalidadComponent {
  @Input() isPopupOpen: boolean = false; // Inicialización en el constructor
  @Output() closed = new EventEmitter<void>();

  closePopup() {
    this.closed.emit();
  }
}
