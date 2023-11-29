import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarEditorialComponent } from './eliminar-editorial.component';

describe('EliminarEditorialComponent', () => {
  let component: EliminarEditorialComponent;
  let fixture: ComponentFixture<EliminarEditorialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EliminarEditorialComponent]
    });
    fixture = TestBed.createComponent(EliminarEditorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
