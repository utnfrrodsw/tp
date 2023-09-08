import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarseComponent } from './registrarse.component';

describe('RegistrarseComponent', () => {
  let component: RegistrarseComponent;
  let fixture: ComponentFixture<RegistrarseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrarseComponent]
    });
    fixture = TestBed.createComponent(RegistrarseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
