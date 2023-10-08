import { TestBed } from '@angular/core/testing';
import { AutoresService } from './autores.service';

describe('AutoresService', () => {
  let service: AutoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
