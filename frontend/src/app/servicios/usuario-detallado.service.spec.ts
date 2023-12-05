import { TestBed } from '@angular/core/testing';

import { UsuarioDetalladoService } from './usuario-detallado.service';

describe('UsuarioDetalladoService', () => {
  let service: UsuarioDetalladoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioDetalladoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
