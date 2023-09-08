import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodasLasOfertasComponent } from './todas-las-ofertas.component';

describe('TodasLasOfertasComponent', () => {
  let component: TodasLasOfertasComponent;
  let fixture: ComponentFixture<TodasLasOfertasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodasLasOfertasComponent]
    });
    fixture = TestBed.createComponent(TodasLasOfertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
