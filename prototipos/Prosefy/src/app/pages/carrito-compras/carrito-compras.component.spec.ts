import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoComprasComponent } from './carrito-compras.component';

describe('CarritoComprasComponent', () => {
  let component: CarritoComprasComponent;
  let fixture: ComponentFixture<CarritoComprasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarritoComprasComponent]
    });
    fixture = TestBed.createComponent(CarritoComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
