import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaVolqueteComponent } from './alta-volquete.component';

describe('AltaVolqueteComponent', () => {
  let component: AltaVolqueteComponent;
  let fixture: ComponentFixture<AltaVolqueteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltaVolqueteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaVolqueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
