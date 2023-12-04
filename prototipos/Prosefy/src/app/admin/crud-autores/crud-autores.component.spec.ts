import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudAutoresComponent } from './crud-autores.component';

describe('CrudAutoresComponent', () => {
  let component: CrudAutoresComponent;
  let fixture: ComponentFixture<CrudAutoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrudAutoresComponent]
    });
    fixture = TestBed.createComponent(CrudAutoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
