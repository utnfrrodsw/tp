import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AutoresComponent } from './autores.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { PopupLocalidadComponent } from '../../shared/popup-localidad/popup-localidad.component';
import { AutoresPopularesComponent } from '../../sections/autores-populares/autores-populares.component';
import { AutoresNuevosComponent } from '../../sections/autores-nuevos/autores-nuevos.component';

describe('AutoresComponent', () => {
  let component: AutoresComponent;
  let fixture: ComponentFixture<AutoresComponent>;

  const fakeActivatedRoute = {
    snapshot: {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutoresComponent, HeaderComponent, FooterComponent, NavbarComponent, PopupLocalidadComponent, AutoresPopularesComponent, AutoresNuevosComponent],
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      imports: [FormsModule, RouterModule]
    });
    fixture = TestBed.createComponent(AutoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
