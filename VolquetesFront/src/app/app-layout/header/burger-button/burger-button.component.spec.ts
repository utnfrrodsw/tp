import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurgerButtonComponent } from './burger-button.component';

describe('BurgerButtonComponent', () => {
  let component: BurgerButtonComponent;
  let fixture: ComponentFixture<BurgerButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BurgerButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BurgerButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
