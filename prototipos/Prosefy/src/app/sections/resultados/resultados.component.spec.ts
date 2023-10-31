import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

import { ResultadosComponent } from './resultados.component';

describe('ResultadosComponent', () => {
  let component: ResultadosComponent;
  let fixture: ComponentFixture<ResultadosComponent>;

  const fakeActivatedRoute = {
    snapshot: {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultadosComponent],
      providers: [DatePipe, { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      imports: [RouterModule]
    });
    fixture = TestBed.createComponent(ResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
