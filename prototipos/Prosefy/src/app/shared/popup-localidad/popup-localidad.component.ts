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
  direcciones: string[] = [
    'Buenos Aires 1345 dpto 2',
    'Wagner 2300 dpto 1',
    'Av. Beethoven 1211',
  ];

  @Input() isPopupOpen: boolean = false;
  selectedDireccion: string = '';
  enOtraUbicacion: boolean = false;
  @Output() closed = new EventEmitter<void>();
  closePopup() {
    this.closed.emit();
  }
  toggleEnOtraUbicacion() {
    this.enOtraUbicacion = this.selectedDireccion === 'En otra ubicación';
  }
}
