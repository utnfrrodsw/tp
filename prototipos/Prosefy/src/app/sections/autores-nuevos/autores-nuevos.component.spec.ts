import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoresNuevosComponent } from './autores-nuevos.component';

describe('AutoresNuevosComponent', () => {
  let component: AutoresNuevosComponent;
  let fixture: ComponentFixture<AutoresNuevosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutoresNuevosComponent],
    });
    fixture = TestBed.createComponent(AutoresNuevosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
