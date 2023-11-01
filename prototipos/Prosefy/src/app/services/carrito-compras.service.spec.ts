import { TestBed } from '@angular/core/testing';

import { CarritoComprasService } from './carrito-compras.service';

describe('CarritoComprasService', () => {
  let service: CarritoComprasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarritoComprasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
