import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Libro1Component } from './libro1.component';

describe('Libro1Component', () => {
  let component: Libro1Component;
  let fixture: ComponentFixture<Libro1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Libro1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Libro1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
