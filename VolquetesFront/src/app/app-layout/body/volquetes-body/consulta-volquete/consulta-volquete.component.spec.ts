import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaVolqueteComponent } from './consulta-volquete.component';

describe('ConsultaVolqueteComponent', () => {
  let component: ConsultaVolqueteComponent;
  let fixture: ComponentFixture<ConsultaVolqueteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaVolqueteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaVolqueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
