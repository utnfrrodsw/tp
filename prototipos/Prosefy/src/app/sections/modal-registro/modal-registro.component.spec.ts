import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRegistroComponent } from './modal-registro.component';

describe('ModalRegistroComponent', () => {
  let component: ModalRegistroComponent;
  let fixture: ComponentFixture<ModalRegistroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalRegistroComponent]
    });
    fixture = TestBed.createComponent(ModalRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
