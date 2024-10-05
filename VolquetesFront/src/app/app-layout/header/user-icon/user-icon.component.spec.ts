import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIconComponent } from './user-icon.component';

describe('UserIconComponent', () => {
  let component: UserIconComponent;
  let fixture: ComponentFixture<UserIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
