import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  // Propiedad para controlar si el encabezado se ha desplazado
  headerScrolled = false;
  placeholderText = 'Buscar...'; // Valor predeterminado
  searchTerm: string = '';
  // Variable de estado para controlar la visibilidad de las opciones de usuario
  showUserOptions: boolean = false;
  // Esta variable indica si el usuario ha iniciado sesión
  loggedIn: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updatePlaceholder(event.url);
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.searchTerm = params['term'] || ''; // Si 'term' no está presente, establece el valor como una cadena vacía
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

  toggleUserOptions() {
    this.showUserOptions = !this.showUserOptions;
    console.log('showUserOptions:', this.showUserOptions);
  }

  search() {
    if (this.searchTerm.trim() !== '') {
      this.router.navigate(['/busqueda', this.searchTerm]);
    }
  }
}
