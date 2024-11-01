import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaCheckinComponent } from './alerta-checkin.component';

describe('AlertaCheckinComponent', () => {
  let component: AlertaCheckinComponent;
  let fixture: ComponentFixture<AlertaCheckinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertaCheckinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlertaCheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
