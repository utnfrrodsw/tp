import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListaLibrosComponent } from '../../shared/lista-libros/lista-libros.component';
import { ActivatedRoute } from '@angular/router';

import { LibrosRecomendadosComponent } from './libros-recomendados.component';

describe('LibrosRecomendadosComponent', () => {
  let component: LibrosRecomendadosComponent;
  let fixture: ComponentFixture<LibrosRecomendadosComponent>;

  beforeEach(async () => {
    const activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: (key: string) => {
            return 'mockParam';
          },
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [LibrosRecomendadosComponent, ListaLibrosComponent],
      imports: [CommonModule, RouterModule],
      providers: [DatePipe, { provide: ActivatedRoute, useValue: activatedRouteStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibrosRecomendadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
