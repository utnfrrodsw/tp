import { TestBed } from '@angular/core/testing';

import { IniciarSesionService } from './iniciar-sesion.service';

describe('IniciarSesionService', () => {
  let service: IniciarSesionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IniciarSesionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
