import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonVolverComponent } from './boton-volver.component';

describe('BotonVolverComponent', () => {
  let component: BotonVolverComponent;
  let fixture: ComponentFixture<BotonVolverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BotonVolverComponent]
    });
    fixture = TestBed.createComponent(BotonVolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
