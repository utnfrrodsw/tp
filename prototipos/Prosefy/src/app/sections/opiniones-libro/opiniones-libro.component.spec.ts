import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpinionesLibroComponent } from './opiniones-libro.component';

describe('OpinionesLibroComponent', () => {
  let component: OpinionesLibroComponent;
  let fixture: ComponentFixture<OpinionesLibroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpinionesLibroComponent]
    });
    fixture = TestBed.createComponent(OpinionesLibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
