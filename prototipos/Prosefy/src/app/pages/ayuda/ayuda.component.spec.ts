import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { AyudaComponent } from './ayuda.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { PopupLocalidadComponent } from '../../shared/popup-localidad/popup-localidad.component';
import { SeccionesAyudaComponent } from '../../sections/secciones-ayuda/secciones-ayuda.component';

describe('AyudaComponent', () => {
  let component: AyudaComponent;
  let fixture: ComponentFixture<AyudaComponent>;

  const fakeActivatedRoute = {
    snapshot: {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AyudaComponent, HeaderComponent, FooterComponent, NavbarComponent, PopupLocalidadComponent, SeccionesAyudaComponent],
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      imports: [FormsModule, RouterModule]
    });
    fixture = TestBed.createComponent(AyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
