import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudLibrosComponent } from './crud-libros.component';

describe('CrudLibrosComponent', () => {
  let component: CrudLibrosComponent;
  let fixture: ComponentFixture<CrudLibrosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrudLibrosComponent]
    });
    fixture = TestBed.createComponent(CrudLibrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
