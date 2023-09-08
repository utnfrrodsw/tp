import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoLibroSeleccionadoComponent } from './info-libro-seleccionado.component';

describe('InfoLibroSeleccionadoComponent', () => {
  let component: InfoLibroSeleccionadoComponent;
  let fixture: ComponentFixture<InfoLibroSeleccionadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoLibroSeleccionadoComponent]
    });
    fixture = TestBed.createComponent(InfoLibroSeleccionadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
