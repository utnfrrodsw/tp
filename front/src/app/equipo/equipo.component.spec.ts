import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoComponent } from './equipo.component';

describe('EquipoComponent', () => {
  let component: EquipoComponent;
  let fixture: ComponentFixture<EquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EquipoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});