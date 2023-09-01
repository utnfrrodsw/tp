import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionOfertasComponent } from './seccion-ofertas.component';

describe('SeccionOfertasComponent', () => {
  let component: SeccionOfertasComponent;
  let fixture: ComponentFixture<SeccionOfertasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeccionOfertasComponent]
    });
    fixture = TestBed.createComponent(SeccionOfertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
