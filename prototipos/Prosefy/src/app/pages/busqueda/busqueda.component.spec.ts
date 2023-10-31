import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BusquedaComponent } from './busqueda.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { PopupLocalidadComponent } from '../../shared/popup-localidad/popup-localidad.component';
import { FiltrarResultadosComponent } from '../../sections/filtrar-resultados/filtrar-resultados.component';
import { ResultadosComponent } from '../../sections/resultados/resultados.component';

describe('BusquedaComponent', () => {
  let component: BusquedaComponent;
  let fixture: ComponentFixture<BusquedaComponent>;

  const fakeActivatedRoute = {
    snapshot: {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusquedaComponent, HeaderComponent, FooterComponent, NavbarComponent, PopupLocalidadComponent, FiltrarResultadosComponent, ResultadosComponent],
      providers: [
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        DatePipe
      ],
      imports: [CommonModule, FormsModule, RouterModule]
    });
    fixture = TestBed.createComponent(BusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
