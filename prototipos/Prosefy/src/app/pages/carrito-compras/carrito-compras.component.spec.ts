import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoComprasComponent } from './carrito-compras.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { BotonVolverComponent } from '../../shared/boton-volver/boton-volver.component';
import { ProductosCarritoComprasComponent } from '../../sections/productos-carrito-compras/productos-carrito-compras.component';
import { LibrosRecomendadosComponent } from '../../sections/libros-recomendados/libros-recomendados.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PopupLocalidadComponent } from '../../shared/popup-localidad/popup-localidad.component';
import { ListaLibrosComponent } from '../../shared/lista-libros/lista-libros.component';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('CarritoComprasComponent', () => {
  let component: CarritoComprasComponent;
  let fixture: ComponentFixture<CarritoComprasComponent>;

  beforeEach(() => {
    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => {
            return null;
          },
        },
      },
    };

    TestBed.configureTestingModule({
      declarations: [
        CarritoComprasComponent,
        HeaderComponent,
        NavbarComponent,
        BotonVolverComponent,
        ProductosCarritoComprasComponent,
        LibrosRecomendadosComponent,
        FooterComponent,
        PopupLocalidadComponent,
        ListaLibrosComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        DatePipe
      ],
      imports: [ReactiveFormsModule, FormsModule, RouterModule]
    });
    fixture = TestBed.createComponent(CarritoComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
