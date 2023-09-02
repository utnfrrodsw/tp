import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoresPopularesComponent } from './autores-populares.component';

describe('AutoresPopularesComponent', () => {
  let component: AutoresPopularesComponent;
  let fixture: ComponentFixture<AutoresPopularesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutoresPopularesComponent]
    });
    fixture = TestBed.createComponent(AutoresPopularesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
