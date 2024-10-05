import { TestBed } from '@angular/core/testing';

import { TiposVolqueteService } from './tipos-volquete.service';

describe('TiposVolqueteService', () => {
  let service: TiposVolqueteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposVolqueteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
