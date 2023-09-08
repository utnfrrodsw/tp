import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagarComponent } from './pagar.component';

describe('PagarComponent', () => {
  let component: PagarComponent;
  let fixture: ComponentFixture<PagarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PagarComponent]
    });
    fixture = TestBed.createComponent(PagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
