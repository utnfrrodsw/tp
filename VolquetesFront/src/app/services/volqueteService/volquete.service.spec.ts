import { TestBed } from '@angular/core/testing';

import { VolqueteService } from './volquete.service';

describe('VolqueteService', () => {
  let service: VolqueteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VolqueteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
