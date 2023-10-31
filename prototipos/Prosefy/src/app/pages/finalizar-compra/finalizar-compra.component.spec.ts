import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizarCompraComponent } from './finalizar-compra.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { PopupLocalidadComponent } from '../../shared/popup-localidad/popup-localidad.component';

describe('FinalizarCompraComponent', () => {
  let component: FinalizarCompraComponent;
  let fixture: ComponentFixture<FinalizarCompraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinalizarCompraComponent, HeaderComponent, FooterComponent, NavbarComponent, PopupLocalidadComponent]
    });
    fixture = TestBed.createComponent(FinalizarCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
