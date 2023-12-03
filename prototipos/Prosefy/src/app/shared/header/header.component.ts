import { Component, EventEmitter, Output } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { IniciarSesionService } from 'src/app/services/iniciar-sesion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  usuario: any = {};
  isAdmin: boolean = false;
  // Propiedad para controlar si el encabezado se ha desplazado
  headerScrolled = false;
  placeholderText = 'Buscar...'; // Valor predeterminado
  searchTerm: string = '';
  // Variable de estado para controlar la visibilidad de las opciones de usuario
  showUserOptions: boolean = false;
  // Esta variable indica si el usuario ha iniciado sesión
  isLoggedIn: boolean = false;
  isPopupOpen: boolean = false;

  @Output() closed = new EventEmitter<void>();

  openPopup(): void {
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
  }

  constructor(private router: Router, private route: ActivatedRoute, private iniciarSesionService: IniciarSesionService, private usuarioService: UsuarioService) {
    this.router.events.pipe(
      filter(((event): event is NavigationEnd => event instanceof NavigationEnd)
      )).subscribe((event: NavigationEnd) => {
        this.updatePlaceholder(event.url);
      });
  }

  ngOnInit() {
    if (this.route && this.route.params) {
      this.route.params.subscribe((params) => {
        this.searchTerm = params['term'] || '';
      });
    }

    this.iniciarSesionService.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
      // Verificar si el usuario ha iniciado sesión antes de llamar a getTipo
      if (this.isLoggedIn) {
        this.obtenerTipoUsuario();
      }
    });
  }

  private obtenerTipoUsuario() {
    this.usuarioService.getTipo().subscribe(
      (data: any) => {
        this.usuario.tipo = data.data.tipo;
        if (this.usuario.tipo.trim() === 'admin') {
          this.isAdmin = true;
        }
      },
      (error: any) => {
        console.error('Error obteniendo tipo:', error);
      }
    );
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
    this.iniciarSesionService.cerrarSesion().subscribe(
      response => {
        console.log('Éxito al cerrar sesión:', response);
      },
      error => {
        console.error('Error al cerrar sesión:', error);
      }
    );
    this.openPopup();
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  closeUserOptions() {
    this.showUserOptions = false;
  }

}