import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorialesComponent } from './editoriales.component';

describe('EditorialesComponent', () => {
  let component: EditorialesComponent;
  let fixture: ComponentFixture<EditorialesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditorialesComponent]
    });
    fixture = TestBed.createComponent(EditorialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
