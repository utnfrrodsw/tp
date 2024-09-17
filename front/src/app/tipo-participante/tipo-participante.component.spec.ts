import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoParticipanteComponent } from './tipo-participante.component';

describe('TipoParticipanteComponent', () => {
  let component: TipoParticipanteComponent;
  let fixture: ComponentFixture<TipoParticipanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TipoParticipanteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TipoParticipanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});