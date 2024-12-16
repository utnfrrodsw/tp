import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarHabitacionesComponent } from './mostrar-habitaciones.component';

describe('MostrarHabitacionesComponent', () => {
  let component: MostrarHabitacionesComponent;
  let fixture: ComponentFixture<MostrarHabitacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MostrarHabitacionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MostrarHabitacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
