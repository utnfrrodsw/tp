import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadernavComponent } from './headernav.component';

describe('HeadernavComponent', () => {
  let component: HeadernavComponent;
  let fixture: ComponentFixture<HeadernavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeadernavComponent]
    });
    fixture = TestBed.createComponent(HeadernavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
