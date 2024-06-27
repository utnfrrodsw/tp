import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondHeaderComponent } from './second-header.component';

describe('SecondHeaderComponent', () => {
  let component: SecondHeaderComponent;
  let fixture: ComponentFixture<SecondHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
