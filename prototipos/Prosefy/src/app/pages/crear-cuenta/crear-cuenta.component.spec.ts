import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCuentaComponent } from './crear-cuenta.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { PopupLocalidadComponent } from '../../shared/popup-localidad/popup-localidad.component';

describe('CrearCuentaComponent', () => {
  let component: CrearCuentaComponent;
  let fixture: ComponentFixture<CrearCuentaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearCuentaComponent, HeaderComponent, FooterComponent, NavbarComponent, PopupLocalidadComponent]
    });
    fixture = TestBed.createComponent(CrearCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
