import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarEliminacionComponent } from './confirmar-eliminacion.component';

describe('ConfirmarEliminacionComponent', () => {
  let component: ConfirmarEliminacionComponent;
  let fixture: ComponentFixture<ConfirmarEliminacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmarEliminacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmarEliminacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
