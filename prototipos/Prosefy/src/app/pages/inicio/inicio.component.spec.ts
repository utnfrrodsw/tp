import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

import { InicioComponent } from './inicio.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { OfertasDestacadasComponent } from '../../sections/ofertas-destacadas/ofertas-destacadas.component';
import { LibrosRecomendadosComponent } from '../../sections/libros-recomendados/libros-recomendados.component';
import { LibrosMasVendidosComponent } from '../../sections/libros-mas-vendidos/libros-mas-vendidos.component';
import { NuevosLanzamientosComponent } from '../../sections/nuevos-lanzamientos/nuevos-lanzamientos.component';
import { AutoresPopularesComponent } from '../../sections/autores-populares/autores-populares.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { PopupLocalidadComponent } from '../../shared/popup-localidad/popup-localidad.component';
import { ListaLibrosComponent } from '../../shared/lista-libros/lista-libros.component';

describe('InicioComponent', () => {
  let component: InicioComponent;
  let fixture: ComponentFixture<InicioComponent>;

  beforeEach(() => {
    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => {
            return null;
          },
        },
      },
    };

    TestBed.configureTestingModule({
      declarations: [InicioComponent, HeaderComponent, NavbarComponent, OfertasDestacadasComponent, LibrosRecomendadosComponent, LibrosMasVendidosComponent, NuevosLanzamientosComponent, AutoresPopularesComponent, FooterComponent, PopupLocalidadComponent, ListaLibrosComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        DatePipe,
      ],
      imports: [ReactiveFormsModule, FormsModule, RouterModule],
    });

    fixture = TestBed.createComponent(InicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
