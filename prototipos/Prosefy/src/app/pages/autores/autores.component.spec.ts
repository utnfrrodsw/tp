import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoresComponent } from './autores.component';

describe('AutoresComponent', () => {
  let component: AutoresComponent;
  let fixture: ComponentFixture<AutoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutoresComponent]
    });
    fixture = TestBed.createComponent(AutoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
