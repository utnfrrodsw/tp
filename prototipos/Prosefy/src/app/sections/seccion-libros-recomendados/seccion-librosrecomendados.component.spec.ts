import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionLibrosrecomendadosComponent } from './seccion-librosrecomendados.component';

describe('SeccionLibrosrecomendadosComponent', () => {
  let component: SeccionLibrosrecomendadosComponent;
  let fixture: ComponentFixture<SeccionLibrosrecomendadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeccionLibrosrecomendadosComponent]
    });
    fixture = TestBed.createComponent(SeccionLibrosrecomendadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
