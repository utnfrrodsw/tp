import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadosComponent } from './resultados.component';

describe('ResultadosComponent', () => {
  let component: ResultadosComponent;
  let fixture: ComponentFixture<ResultadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultadosComponent]
    });
    fixture = TestBed.createComponent(ResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
