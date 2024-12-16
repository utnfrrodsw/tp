import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarServiciosComponent } from './mostrar-servicios.component';

describe('MostrarServiciosComponent', () => {
  let component: MostrarServiciosComponent;
  let fixture: ComponentFixture<MostrarServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MostrarServiciosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MostrarServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
