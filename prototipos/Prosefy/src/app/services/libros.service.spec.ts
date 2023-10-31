import { TestBed } from '@angular/core/testing';
import { CommonModule, DatePipe } from '@angular/common';

import { LibrosService } from './libros.service';

describe('LibrosService', () => {
  let service: LibrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      providers: [DatePipe],
    });
    service = TestBed.inject(LibrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
