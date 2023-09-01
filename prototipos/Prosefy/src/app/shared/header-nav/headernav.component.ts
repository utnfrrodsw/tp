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
  isPopupOpen: boolean = false;

  // Escuchar el evento de desplazamiento de la ventana y actualizar headerScrolled
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Comprobar si el usuario ha desplazado la página hacia abajo
    this.headerScrolled = window.scrollY > 0;
  }

  // Método para abrir la ventana emergente (popup)
  openPopup() {
    this.isPopupOpen = true;
  }

  // Método para cerrar la ventana emergente (popup)
  closePopup() {
    this.isPopupOpen = false;
  }
}
