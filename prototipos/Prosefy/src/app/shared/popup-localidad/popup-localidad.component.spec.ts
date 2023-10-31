import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, ActivatedRoute } from '@angular/router';

import { PopupLocalidadComponent } from './popup-localidad.component';

describe('PopupLocalidadComponent', () => {
  let component: PopupLocalidadComponent;
  let fixture: ComponentFixture<PopupLocalidadComponent>;

  beforeEach(() => {
    const fakeActivatedRoute = { snapshot: {} };

    TestBed.configureTestingModule({
      declarations: [PopupLocalidadComponent],
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      imports: [RouterModule]
    });
    fixture = TestBed.createComponent(PopupLocalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
