import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CrearCuentaComponent } from './crear-cuenta.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { PopupLocalidadComponent } from '../../shared/popup-localidad/popup-localidad.component';
import { BotonVolverComponent } from '../../shared/boton-volver/boton-volver.component';
import { RegistrarseComponent } from '../../sections/registrarse/registrarse.component';

describe('CrearCuentaComponent', () => {
  let component: CrearCuentaComponent;
  let fixture: ComponentFixture<CrearCuentaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CrearCuentaComponent,
        HeaderComponent,
        FooterComponent,
        NavbarComponent,
        PopupLocalidadComponent,
        BotonVolverComponent,
        RegistrarseComponent
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
      imports: [FormsModule, ReactiveFormsModule, RouterModule]
    });
    fixture = TestBed.createComponent(CrearCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
