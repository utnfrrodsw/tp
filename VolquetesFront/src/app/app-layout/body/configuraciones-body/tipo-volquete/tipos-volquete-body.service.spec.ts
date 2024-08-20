import { TestBed } from '@angular/core/testing';

import { TiposVolqueteBodyService } from './tipos-volquete-body.service';

describe('TiposVolqueteService', () => {
  let service: TiposVolqueteBodyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposVolqueteBodyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
