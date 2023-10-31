import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { OfertasComponent } from './ofertas.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { PopupLocalidadComponent } from '../../shared/popup-localidad/popup-localidad.component';
import { OfertasDestacadasComponent } from '../../sections/ofertas-destacadas/ofertas-destacadas.component';
import { TodasLasOfertasComponent } from '../../sections/todas-las-ofertas/todas-las-ofertas.component';

describe('OfertasComponent', () => {
  let component: OfertasComponent;
  let fixture: ComponentFixture<OfertasComponent>;

  beforeEach(() => {
    const activatedRouteStub = {};

    TestBed.configureTestingModule({
      declarations: [OfertasComponent, HeaderComponent, FooterComponent, NavbarComponent, PopupLocalidadComponent, OfertasDestacadasComponent, TodasLasOfertasComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ],
      imports: [
        FormsModule,
        RouterModule
      ]
    });
    fixture = TestBed.createComponent(OfertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
