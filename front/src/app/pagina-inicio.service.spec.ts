import { TestBed } from '@angular/core/testing';

import { PaginaInicioService } from './pagina-inicio.service';

describe('PaginaInicioService', () => {
  let service: PaginaInicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginaInicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
