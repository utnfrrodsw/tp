import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudEditorialesComponent } from './crud-editoriales.component';

describe('CrudEditorialesComponent', () => {
  let component: CrudEditorialesComponent;
  let fixture: ComponentFixture<CrudEditorialesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrudEditorialesComponent]
    });
    fixture = TestBed.createComponent(CrudEditorialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
