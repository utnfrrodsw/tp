import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-headernav',
  templateUrl: './headernav.component.html',
  styleUrls: ['./headernav.component.css'],
})
export class HeadernavComponent {
  // Propiedad para controlar si el encabezado se ha desplazado
  headerScrolled = false;
  // Propiedad para controlar si está abierta una ventana emergente (popup)
  isPopupOpen = false;

  openPopup() {
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
  }
}
