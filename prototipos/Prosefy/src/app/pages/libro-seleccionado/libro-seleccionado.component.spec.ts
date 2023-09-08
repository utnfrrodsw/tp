import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroSeleccionadoComponent } from './libro-seleccionado.component';

describe('LibroSeleccionadoComponent', () => {
  let component: LibroSeleccionadoComponent;
  let fixture: ComponentFixture<LibroSeleccionadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LibroSeleccionadoComponent]
    });
    fixture = TestBed.createComponent(LibroSeleccionadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
