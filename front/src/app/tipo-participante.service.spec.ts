import { TestBed } from '@angular/core/testing';

import { TipoParticipanteService } from './tipo-participante.service';

describe('TipoParticipanteService', () => {
  let service: TipoParticipanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoParticipanteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
