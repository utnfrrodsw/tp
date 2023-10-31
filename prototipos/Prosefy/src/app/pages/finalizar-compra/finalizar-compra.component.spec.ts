import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FinalizarCompraComponent } from './finalizar-compra.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { PopupLocalidadComponent } from '../../shared/popup-localidad/popup-localidad.component';
import { BotonVolverComponent } from '../../shared/boton-volver/boton-volver.component';
import { RouterModule } from '@angular/router';
import { PagarComponent } from '../../sections/pagar/pagar.component';

describe('FinalizarCompraComponent', () => {
  let component: FinalizarCompraComponent;
  let fixture: ComponentFixture<FinalizarCompraComponent>;

  const fakeActivatedRoute = {
    snapshot: {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FinalizarCompraComponent,
        HeaderComponent,
        FooterComponent,
        NavbarComponent,
        PopupLocalidadComponent,
        BotonVolverComponent,
        PagarComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ],
      imports: [RouterModule, FormsModule]
    });
    fixture = TestBed.createComponent(FinalizarCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
