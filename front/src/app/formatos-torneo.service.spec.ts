import { TestBed } from '@angular/core/testing';

import { FormatosTorneoService } from './formatos-torneo.service';

describe('FormatosTorneoService', () => {
  let service: FormatosTorneoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatosTorneoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
