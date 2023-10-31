import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrosMasVendidosComponent } from './libros-mas-vendidos.component';
import { ListaLibrosComponent } from '../../shared/lista-libros/lista-libros.component';

describe('LibrosMasVendidosComponent', () => {
  let component: LibrosMasVendidosComponent;
  let fixture: ComponentFixture<LibrosMasVendidosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LibrosMasVendidosComponent, ListaLibrosComponent]
    });
    fixture = TestBed.createComponent(LibrosMasVendidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
