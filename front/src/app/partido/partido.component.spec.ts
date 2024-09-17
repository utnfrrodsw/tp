import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidoComponent } from './partido.component';

describe('PartidoComponent', () => {
  let component: PartidoComponent;
  let fixture: ComponentFixture<PartidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartidoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});