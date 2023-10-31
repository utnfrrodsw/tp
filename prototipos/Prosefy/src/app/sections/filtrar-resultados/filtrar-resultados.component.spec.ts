import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { FiltrarResultadosComponent } from './filtrar-resultados.component';

describe('FiltrarResultadosComponent', () => {
  let component: FiltrarResultadosComponent;
  let fixture: ComponentFixture<FiltrarResultadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FiltrarResultadosComponent],
      imports: [FormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrarResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
