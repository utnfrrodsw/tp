import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoTorneoComponent } from './estado-torneo.component';

describe('EstadoTorneoComponent', () => {
  let component: EstadoTorneoComponent;
  let fixture: ComponentFixture<EstadoTorneoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstadoTorneoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstadoTorneoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});