import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEmpleadoComponent } from './registro-empleado.component';

describe('RegistroEmpleadoComponent', () => {
  let component: RegistroEmpleadoComponent;
  let fixture: ComponentFixture<RegistroEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroEmpleadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistroEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
