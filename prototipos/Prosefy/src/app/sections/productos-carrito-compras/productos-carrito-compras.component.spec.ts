import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosCarritoComprasComponent } from './productos-carrito-compras.component';

describe('ProductosCarritoComprasComponent', () => {
  let component: ProductosCarritoComprasComponent;
  let fixture: ComponentFixture<ProductosCarritoComprasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductosCarritoComprasComponent]
    });
    fixture = TestBed.createComponent(ProductosCarritoComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
