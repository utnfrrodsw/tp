import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';

import { PerfilUsuarioComponent } from './perfil-usuario.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { PopupLocalidadComponent } from '../../shared/popup-localidad/popup-localidad.component';
import { InfoUsuarioComponent } from '../../sections/info-usuario/info-usuario.component';

describe('PerfilUsuarioComponent', () => {
  let component: PerfilUsuarioComponent;
  let fixture: ComponentFixture<PerfilUsuarioComponent>;

  const fakeActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => {
          return '1';
        }
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerfilUsuarioComponent, HeaderComponent, NavbarComponent, FooterComponent, PopupLocalidadComponent, InfoUsuarioComponent],
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      imports: [ReactiveFormsModule, FormsModule, RouterModule]
    });
    fixture = TestBed.createComponent(PerfilUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
