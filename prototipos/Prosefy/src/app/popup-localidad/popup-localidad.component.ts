import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-popup-localidad',
  templateUrl: './popup-localidad.component.html',
  styleUrls: ['./popup-localidad.component.css'],
})
export class PopupLocalidadComponent {
  direcciones: string[] = ['Dirección 1', 'Dirección 2', 'Dirección 3'];

  @Input() isPopupOpen: boolean = false; // Inicialización en el constructor
  selectedDireccion: string = ''; // Propiedad para realizar el seguimiento de la dirección seleccionada
  enOtraUbicacion: boolean = false; // Propiedad para controlar el botón
  @Output() closed = new EventEmitter<void>();
  closePopup() {
    this.closed.emit();
  }
  toggleEnOtraUbicacion() {
    this.enOtraUbicacion = this.selectedDireccion === 'En otra ubicación';
  }
}
