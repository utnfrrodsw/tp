import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrarResultadosComponent } from './filtrar-resultados.component';

describe('FiltrarResultadosComponent', () => {
  let component: FiltrarResultadosComponent;
  let fixture: ComponentFixture<FiltrarResultadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltrarResultadosComponent]
    });
    fixture = TestBed.createComponent(FiltrarResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
