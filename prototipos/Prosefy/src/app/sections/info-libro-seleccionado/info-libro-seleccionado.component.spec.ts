import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { InfoLibroSeleccionadoComponent } from './info-libro-seleccionado.component';

describe('InfoLibroSeleccionadoComponent', () => {
  let component: InfoLibroSeleccionadoComponent;
  let fixture: ComponentFixture<InfoLibroSeleccionadoComponent>;

  beforeEach(() => {
    const fakeActivatedRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => {
            return '1';
          },
        },
      },
    };

    TestBed.configureTestingModule({
      declarations: [InfoLibroSeleccionadoComponent],
      providers: [DatePipe, { provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    });
    fixture = TestBed.createComponent(InfoLibroSeleccionadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
