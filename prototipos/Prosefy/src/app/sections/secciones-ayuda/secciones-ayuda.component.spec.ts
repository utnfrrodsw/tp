import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeccionesAyudaComponent } from './secciones-ayuda.component';

describe('SeccionesAyudaComponent', () => {
  let component: SeccionesAyudaComponent;
  let fixture: ComponentFixture<SeccionesAyudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeccionesAyudaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionesAyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the SeccionesAyudaComponent', () => {
    expect(component).toBeTruthy();
  });
});
