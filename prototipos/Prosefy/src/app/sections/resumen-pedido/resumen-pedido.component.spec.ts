import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenPedidoComponent } from './resumen-pedido.component';

describe('ResumenPedidoComponent', () => {
  let component: ResumenPedidoComponent;
  let fixture: ComponentFixture<ResumenPedidoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResumenPedidoComponent]
    });
    fixture = TestBed.createComponent(ResumenPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
