import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionesAyudaComponent } from './secciones-ayuda.component';

describe('SeccionesAyudaComponent', () => {
  let component: SeccionesAyudaComponent;
  let fixture: ComponentFixture<SeccionesAyudaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeccionesAyudaComponent]
    });
    fixture = TestBed.createComponent(SeccionesAyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
