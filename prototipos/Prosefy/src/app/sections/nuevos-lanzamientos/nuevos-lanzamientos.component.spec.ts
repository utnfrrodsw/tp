import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevosLanzamientosComponent } from './nuevos-lanzamientos.component';

describe('NuevosLanzamientosComponent', () => {
  let component: NuevosLanzamientosComponent;
  let fixture: ComponentFixture<NuevosLanzamientosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevosLanzamientosComponent]
    });
    fixture = TestBed.createComponent(NuevosLanzamientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
