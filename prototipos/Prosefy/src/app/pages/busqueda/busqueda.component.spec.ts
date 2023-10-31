import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaComponent } from './busqueda.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { PopupLocalidadComponent } from '../../shared/popup-localidad/popup-localidad.component';

describe('BusquedaComponent', () => {
  let component: BusquedaComponent;
  let fixture: ComponentFixture<BusquedaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusquedaComponent, HeaderComponent, FooterComponent, NavbarComponent, PopupLocalidadComponent]
    });
    fixture = TestBed.createComponent(BusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
