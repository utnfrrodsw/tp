import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoVolqueteComponent } from './tipo-volquete.component';

describe('TipoVolqueteComponent', () => {
  let component: TipoVolqueteComponent;
  let fixture: ComponentFixture<TipoVolqueteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoVolqueteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoVolqueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
