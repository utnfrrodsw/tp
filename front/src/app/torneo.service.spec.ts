import { TestBed } from '@angular/core/testing';

import { TorneoService } from './torneo.service';

describe('TorneoService', () => {
  let service: TorneoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TorneoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
