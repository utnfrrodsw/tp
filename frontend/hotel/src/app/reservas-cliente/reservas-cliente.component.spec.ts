import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasClienteComponent } from './reservas-cliente.component';

describe('ReservasClienteComponent', () => {
  let component: ReservasClienteComponent;
  let fixture: ComponentFixture<ReservasClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservasClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservasClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
