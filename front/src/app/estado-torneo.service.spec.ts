import { TestBed } from '@angular/core/testing';

import { EstadoTorneoService } from './estado-torneo.service';

describe('EstadoTorneoService', () => {
  let service: EstadoTorneoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadoTorneoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
