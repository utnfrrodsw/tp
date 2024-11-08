import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarHabitacionComponent } from './modificar-habitacion.component';

describe('ModificarHabitacionComponent', () => {
  let component: ModificarHabitacionComponent;
  let fixture: ComponentFixture<ModificarHabitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModificarHabitacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModificarHabitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
