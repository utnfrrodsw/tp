import { TestBed } from '@angular/core/testing';

import { ParticipanteService } from './participante.service';

describe('ParticipanteService', () => {
  let service: ParticipanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipanteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
