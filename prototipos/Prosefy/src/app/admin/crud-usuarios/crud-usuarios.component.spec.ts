import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudUsuariosComponent } from './crud-usuarios.component';

describe('CrudUsuariosComponent', () => {
  let component: CrudUsuariosComponent;
  let fixture: ComponentFixture<CrudUsuariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrudUsuariosComponent]
    });
    fixture = TestBed.createComponent(CrudUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
