import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaVolqueteFormComponent } from './alta-volquete-form.component';

describe('AltaVolqueteFormComponent', () => {
  let component: AltaVolqueteFormComponent;
  let fixture: ComponentFixture<AltaVolqueteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltaVolqueteFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaVolqueteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
