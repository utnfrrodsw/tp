import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, ActivatedRoute } from '@angular/router';

import { NavbarComponent } from './navbar.component';
import { PopupLocalidadComponent } from '../popup-localidad/popup-localidad.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  const fakeActivatedRoute = {
    snapshot: {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent, PopupLocalidadComponent],
      imports: [RouterModule],
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    });
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
