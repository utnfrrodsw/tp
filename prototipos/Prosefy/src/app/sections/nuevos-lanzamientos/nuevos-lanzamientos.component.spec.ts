import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevosLanzamientosComponent } from './nuevos-lanzamientos.component';
import { ListaLibrosComponent } from '../../shared/lista-libros/lista-libros.component';

describe('NuevosLanzamientosComponent', () => {
  let component: NuevosLanzamientosComponent;
  let fixture: ComponentFixture<NuevosLanzamientosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevosLanzamientosComponent, ListaLibrosComponent]
    });
    fixture = TestBed.createComponent(NuevosLanzamientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
