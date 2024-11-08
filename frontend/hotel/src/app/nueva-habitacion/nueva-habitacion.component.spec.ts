import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaHabitacionComponent } from './nueva-habitacion.component';

describe('NuevaHabitacionComponent', () => {
  let component: NuevaHabitacionComponent;
  let fixture: ComponentFixture<NuevaHabitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NuevaHabitacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevaHabitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
