import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { AcercaDeComponent } from './acerca-de.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { PopupLocalidadComponent } from '../../shared/popup-localidad/popup-localidad.component';

describe('AcercaDeComponent', () => {
  let component: AcercaDeComponent;
  let fixture: ComponentFixture<AcercaDeComponent>;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => {
            return null;
          },
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [AcercaDeComponent, HeaderComponent, FooterComponent, NavbarComponent, PopupLocalidadComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteMock }],
      imports: [ReactiveFormsModule, FormsModule, RouterModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcercaDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
