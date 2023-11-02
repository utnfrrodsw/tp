import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { ProductosCarritoComprasComponent } from './productos-carrito-compras.component';

describe('ProductosCarritoComprasComponent', () => {
  let component: ProductosCarritoComprasComponent;
  let fixture: ComponentFixture<ProductosCarritoComprasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductosCarritoComprasComponent],
      providers: [DatePipe],
      imports: [FormsModule]
    });
    fixture = TestBed.createComponent(ProductosCarritoComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
