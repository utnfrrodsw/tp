import { TestBed } from '@angular/core/testing';

import { ComentarioServiceService } from './comentario-service.service';

describe('ComentarioServiceService', () => {
  let service: ComentarioServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComentarioServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
