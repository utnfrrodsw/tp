import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentificarseComponent } from './identificarse.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { PopupLocalidadComponent } from '../../shared/popup-localidad/popup-localidad.component';

describe('IdentificarseComponent', () => {
  let component: IdentificarseComponent;
  let fixture: ComponentFixture<IdentificarseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdentificarseComponent, HeaderComponent, FooterComponent, NavbarComponent, PopupLocalidadComponent],
    });
    fixture = TestBed.createComponent(IdentificarseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
