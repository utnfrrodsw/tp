import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IdentificarseComponent } from './identificarse.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { PopupLocalidadComponent } from '../../shared/popup-localidad/popup-localidad.component';
import { BotonVolverComponent } from '../../shared/boton-volver/boton-volver.component';
import { IniciarSesionComponent } from '../../sections/iniciar-sesion/iniciar-sesion.component';

describe('IdentificarseComponent', () => {
  let component: IdentificarseComponent;
  let fixture: ComponentFixture<IdentificarseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        IdentificarseComponent,
        HeaderComponent,
        FooterComponent,
        NavbarComponent,
        PopupLocalidadComponent,
        BotonVolverComponent,
        IniciarSesionComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  if (key === 'id') {
                    return '1';
                  }
                  return null;
                },
              },
            },
          },
        },
      ],
      imports: [FormsModule, RouterModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentificarseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
