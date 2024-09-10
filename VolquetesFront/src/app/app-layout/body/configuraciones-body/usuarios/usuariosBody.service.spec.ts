import { TestBed } from '@angular/core/testing';

import { UsuariosBodyService } from './usuariosbody.service';

describe('UsuariosbodyService', () => {
  let service: UsuariosBodyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuariosBodyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
