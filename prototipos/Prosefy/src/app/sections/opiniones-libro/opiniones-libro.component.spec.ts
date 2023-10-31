import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { OpinionesLibroComponent } from './opiniones-libro.component';
import { LibrosService } from '../../services/libros.service';
import { ComentarioUsuarioComponent } from '../../shared/comentario-usuario/comentario-usuario.component';

describe('OpinionesLibroComponent', () => {
  let component: OpinionesLibroComponent;
  let fixture: ComponentFixture<OpinionesLibroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpinionesLibroComponent, ComentarioUsuarioComponent],
      providers: [DatePipe, LibrosService],
      imports: [CommonModule, RouterTestingModule]
    });
    fixture = TestBed.createComponent(OpinionesLibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
