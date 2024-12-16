import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginEmpleadoComponent } from './login-empleado.component';

describe('LoginEmpleadoComponent', () => {
  let component: LoginEmpleadoComponent;
  let fixture: ComponentFixture<LoginEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginEmpleadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
