import { TestBed } from '@angular/core/testing';

import { EditorialesService } from './editoriales.service';

describe('EditorialesService', () => {
  let service: EditorialesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditorialesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
