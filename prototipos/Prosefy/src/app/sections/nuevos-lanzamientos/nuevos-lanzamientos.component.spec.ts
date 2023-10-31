import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { NuevosLanzamientosComponent } from './nuevos-lanzamientos.component';
import { ListaLibrosComponent } from '../../shared/lista-libros/lista-libros.component';

describe('NuevosLanzamientosComponent', () => {
  let component: NuevosLanzamientosComponent;
  let fixture: ComponentFixture<NuevosLanzamientosComponent>;

  const fakeActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => {
          return '1';
        }
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevosLanzamientosComponent, ListaLibrosComponent],
      providers: [DatePipe, { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      imports: [CommonModule, RouterModule]
    });
    fixture = TestBed.createComponent(NuevosLanzamientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
