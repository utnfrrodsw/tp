import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
// Para animar la barra de búsqueda cuando cambia de texto
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-headernav',
  templateUrl: './headernav.component.html',
  styleUrls: ['./headernav.component.css'],
  animations: [
    trigger('placeholderAnimation', [
      state('default', style({ color: 'black' })),
      state('inicio', style({ color: 'blue' })),
      state('autores', style({ color: 'green' })),
      transition('* => *', animate('300ms')),
    ]),
  ],
})
export class HeadernavComponent {
  // Propiedad para controlar si el encabezado se ha desplazado
  headerScrolled = false;
  // Propiedad para controlar si está abierta una ventana emergente (popup)
  isPopupOpen = false;
  // Propiedad searchPlaceholder para cambiar el título de la barra de búsqueda
  placeholderText = 'Buscar...'; // Valor predeterminado

  openPopup() {
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
  }

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updatePlaceholder(event.url);
      }
    });
  }

  private updatePlaceholder(url: string) {
    if (url.includes('/inicio')) {
      this.placeholderText = 'Buscar libros...';
    } else if (url.includes('/autores')) {
      this.placeholderText = 'Buscar autores...';
    } else if (url.includes('/editoriales')) {
      this.placeholderText = 'Buscar editoriales...';
    } else if (url.includes('/ayuda')) {
      this.placeholderText = 'Buscar en ayuda...';
    } else {
      this.placeholderText = 'Buscar...';
    }
  }
}
