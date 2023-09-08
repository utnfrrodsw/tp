import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorSeleccionadoComponent } from './autor-seleccionado.component';

describe('AutorSeleccionadoComponent', () => {
  let component: AutorSeleccionadoComponent;
  let fixture: ComponentFixture<AutorSeleccionadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutorSeleccionadoComponent]
    });
    fixture = TestBed.createComponent(AutorSeleccionadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
