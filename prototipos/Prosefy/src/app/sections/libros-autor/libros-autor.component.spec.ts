import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { LibrosAutorComponent } from './libros-autor.component';

describe('LibrosAutorComponent', () => {
  let component: LibrosAutorComponent;
  let fixture: ComponentFixture<LibrosAutorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LibrosAutorComponent],
      providers: [DatePipe, { provide: ActivatedRoute, useValue: {} }],
      imports: [CommonModule, RouterModule]
    });
    fixture = TestBed.createComponent(LibrosAutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
