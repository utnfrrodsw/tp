import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ListaLibrosComponent } from './lista-libros.component';

describe('ListaLibrosComponent', () => {
  let component: ListaLibrosComponent;
  let fixture: ComponentFixture<ListaLibrosComponent>;

  const fakeActivatedRoute = {
    snapshot: {
      data: {},
      paramMap: {
        get: (key: string) => {
          return '1';
        }
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaLibrosComponent],
      providers: [DatePipe, { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      imports: [CommonModule, RouterModule]
    });
    fixture = TestBed.createComponent(ListaLibrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
