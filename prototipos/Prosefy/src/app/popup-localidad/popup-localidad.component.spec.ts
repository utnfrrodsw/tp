import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupLocalidadComponent } from './popup-localidad.component';

describe('PopupLocalidadComponent', () => {
  let component: PopupLocalidadComponent;
  let fixture: ComponentFixture<PopupLocalidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupLocalidadComponent]
    });
    fixture = TestBed.createComponent(PopupLocalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
