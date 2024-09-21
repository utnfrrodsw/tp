import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalComponent } from './animal.component';

describe('AnimalComponent', () => {
  let component: AnimalComponent;
  let fixture: ComponentFixture<AnimalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
