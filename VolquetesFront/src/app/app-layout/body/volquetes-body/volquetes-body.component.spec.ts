import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolquetesBodyComponent } from './volquetes-body.component';

describe('VolquetesBodyComponent', () => {
  let component: VolquetesBodyComponent;
  let fixture: ComponentFixture<VolquetesBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolquetesBodyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolquetesBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
