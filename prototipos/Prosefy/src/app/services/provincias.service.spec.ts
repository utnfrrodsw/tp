import { TestBed } from '@angular/core/testing';

import { ProvinciasService } from './provincias.service';

describe('ProvinciasService', () => {
  let service: ProvinciasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProvinciasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
