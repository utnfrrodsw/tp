import { TestBed } from '@angular/core/testing';

import { UsuarioActualService } from './usuario-actual.service';

describe('UsuarioActualService', () => {
  let service: UsuarioActualService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioActualService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
