import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { LibrosMasVendidosComponent } from './libros-mas-vendidos.component';
import { ListaLibrosComponent } from '../../shared/lista-libros/lista-libros.component';

describe('LibrosMasVendidosComponent', () => {
  let component: LibrosMasVendidosComponent;
  let fixture: ComponentFixture<LibrosMasVendidosComponent>;

  const fakeActivatedRoute = {
    snapshot: {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LibrosMasVendidosComponent, ListaLibrosComponent],
      providers: [DatePipe, { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      imports: [CommonModule, RouterModule]
    });
    fixture = TestBed.createComponent(LibrosMasVendidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
