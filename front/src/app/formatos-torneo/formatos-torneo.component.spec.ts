import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatosTorneoComponent } from './formatos-torneo.component';

describe('FormatosTorneoComponent', () => {
  let component: FormatosTorneoComponent;
  let fixture: ComponentFixture<FormatosTorneoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormatosTorneoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormatosTorneoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});