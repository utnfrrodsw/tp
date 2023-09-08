import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodasLasEditorialesComponent } from './todas-las-editoriales.component';

describe('TodasLasEditorialesComponent', () => {
  let component: TodasLasEditorialesComponent;
  let fixture: ComponentFixture<TodasLasEditorialesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodasLasEditorialesComponent]
    });
    fixture = TestBed.createComponent(TodasLasEditorialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
