import { TestBed } from '@angular/core/testing';

import { LocalidadesService } from './localidades.service';

describe('LocalidadesService', () => {
  let service: LocalidadesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalidadesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
