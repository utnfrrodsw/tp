import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AutorSeleccionadoComponent } from './autor-seleccionado.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { PopupLocalidadComponent } from '../../shared/popup-localidad/popup-localidad.component';
import { InfoAutorComponent } from '../../sections/info-autor/info-autor.component';
import { LibrosAutorComponent } from '../../sections/libros-autor/libros-autor.component';

describe('AutorSeleccionadoComponent', () => {
  let component: AutorSeleccionadoComponent;
  let fixture: ComponentFixture<AutorSeleccionadoComponent>;

  beforeEach(() => {
    const activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: (key: string) => {
            return 'mockParam';
          },
        },
      },
    };

    TestBed.configureTestingModule({
      declarations: [AutorSeleccionadoComponent, HeaderComponent, FooterComponent, NavbarComponent, PopupLocalidadComponent, InfoAutorComponent, LibrosAutorComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        DatePipe
      ],
      imports: [
        FormsModule,
        RouterModule
      ]
    });
    fixture = TestBed.createComponent(AutorSeleccionadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
