import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarHabitacionesDisponiblesComponent } from './mostrar-habitaciones-disponibles.component';

describe('MostrarHabitacionesDisponiblesComponent', () => {
  let component: MostrarHabitacionesDisponiblesComponent;
  let fixture: ComponentFixture<MostrarHabitacionesDisponiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MostrarHabitacionesDisponiblesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MostrarHabitacionesDisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
