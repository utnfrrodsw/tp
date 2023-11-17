import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, RouterModule } from '@angular/router';
import { IniciarSesionService } from 'src/app/services/iniciar-sesion.service';

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
  isLoggedIn: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private iniciarSesionService: IniciarSesionService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updatePlaceholder(event.url);
      }
    });
  }

  ngOnInit() {
    if (this.route && this.route.params) {
      this.route.params.subscribe((params) => {
        this.searchTerm = params['term'] || '';
      });
    }

    // Verifica si el usuario inició sesión
    this.iniciarSesionService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
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

  logout() {
    // Elimina el token del localStorage
    this.iniciarSesionService.cerrarSesion();
    // Actualiza el estado de inicio de sesión
    this.isLoggedIn = false;
    // Redirige al usuario a la página de inicio de sesión
    this.router.navigate(['/identificarse']);
  }
}