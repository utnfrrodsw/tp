import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipanteComponent } from './participante.component';

describe('ParticipanteComponent', () => {
  let component: ParticipanteComponent;
  let fixture: ComponentFixture<ParticipanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParticipanteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticipanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});