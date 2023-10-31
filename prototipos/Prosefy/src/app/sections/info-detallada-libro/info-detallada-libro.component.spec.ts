import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';

import { InfoDetalladaLibroComponent } from './info-detallada-libro.component';
import { LibrosAutorComponent } from '../libros-autor/libros-autor.component';

describe('InfoDetalladaLibroComponent', () => {
  let component: InfoDetalladaLibroComponent;
  let fixture: ComponentFixture<InfoDetalladaLibroComponent>;

  const fakeActivatedRoute = {
    snapshot: {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoDetalladaLibroComponent, LibrosAutorComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: fakeActivatedRoute
        },
        DatePipe
      ],
      imports: [RouterModule]
    });
    fixture = TestBed.createComponent(InfoDetalladaLibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
