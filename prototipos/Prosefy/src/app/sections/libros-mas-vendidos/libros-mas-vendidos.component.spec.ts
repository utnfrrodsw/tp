import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrosMasVendidosComponent } from './libros-mas-vendidos.component';

describe('LibrosMasVendidosComponent', () => {
  let component: LibrosMasVendidosComponent;
  let fixture: ComponentFixture<LibrosMasVendidosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LibrosMasVendidosComponent]
    });
    fixture = TestBed.createComponent(LibrosMasVendidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
