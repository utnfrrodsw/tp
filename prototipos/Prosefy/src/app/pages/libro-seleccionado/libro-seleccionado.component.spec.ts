import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LibroSeleccionadoComponent } from './libro-seleccionado.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { PopupLocalidadComponent } from '../../shared/popup-localidad/popup-localidad.component';
import { BotonVolverComponent } from '../../shared/boton-volver/boton-volver.component';
import { InfoLibroSeleccionadoComponent } from '../../sections/info-libro-seleccionado/info-libro-seleccionado.component';
import { LibrosRecomendadosComponent } from '../../sections/libros-recomendados/libros-recomendados.component';
import { InfoDetalladaLibroComponent } from '../../sections/info-detallada-libro/info-detallada-libro.component';
import { OpinionesLibroComponent } from '../../sections/opiniones-libro/opiniones-libro.component';
import { ListaLibrosComponent } from '../../shared/lista-libros/lista-libros.component';
import { LibrosAutorComponent } from '../../sections/libros-autor/libros-autor.component';
import { ComentarioUsuarioComponent } from '../../shared/comentario-usuario/comentario-usuario.component';

describe('LibroSeleccionadoComponent', () => {
  let component: LibroSeleccionadoComponent;
  let fixture: ComponentFixture<LibroSeleccionadoComponent>;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => {
            if (key === 'id') {
              return '1';
            }
            return null;
          },
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [LibroSeleccionadoComponent, HeaderComponent, NavbarComponent, FooterComponent, PopupLocalidadComponent, BotonVolverComponent, InfoLibroSeleccionadoComponent, InfoDetalladaLibroComponent, LibrosRecomendadosComponent, OpinionesLibroComponent, ListaLibrosComponent, LibrosAutorComponent, ComentarioUsuarioComponent],
      providers: [DatePipe, { provide: ActivatedRoute, useValue: activatedRouteMock }],
      imports: [ReactiveFormsModule, FormsModule, RouterModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibroSeleccionadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
