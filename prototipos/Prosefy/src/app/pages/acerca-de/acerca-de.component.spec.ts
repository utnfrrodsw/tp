import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcercaDeComponent } from './acerca-de.component';

describe('AcercaDeComponent', () => {
  let component: AcercaDeComponent;
  let fixture: ComponentFixture<AcercaDeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcercaDeComponent]
    });
    fixture = TestBed.createComponent(AcercaDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
