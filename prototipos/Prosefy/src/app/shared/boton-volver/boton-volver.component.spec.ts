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

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should go back in history when goBack is called', () => {
    const spy = spyOn(window.history, 'back');
    component.goBack();
    expect(spy).toHaveBeenCalled();
  });
});