import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoresComponent } from './autores.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { PopupLocalidadComponent } from '../../shared/popup-localidad/popup-localidad.component';

describe('AutoresComponent', () => {
  let component: AutoresComponent;
  let fixture: ComponentFixture<AutoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutoresComponent, HeaderComponent, FooterComponent, NavbarComponent, PopupLocalidadComponent]
    });
    fixture = TestBed.createComponent(AutoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
