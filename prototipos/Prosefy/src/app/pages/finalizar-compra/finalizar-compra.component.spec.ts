import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizarCompraComponent } from './finalizar-compra.component';

describe('FinalizarCompraComponent', () => {
  let component: FinalizarCompraComponent;
  let fixture: ComponentFixture<FinalizarCompraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinalizarCompraComponent]
    });
    fixture = TestBed.createComponent(FinalizarCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
