import { TestBed } from '@angular/core/testing';

import { SmoothScrollService } from './smooth-scroll.service';

describe('SmoothScrollService', () => {
  let service: SmoothScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmoothScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
