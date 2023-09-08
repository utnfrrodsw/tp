import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdentificarseComponent } from './identificarse.component';

describe('IdentificarseComponent', () => {
  let component: IdentificarseComponent;
  let fixture: ComponentFixture<IdentificarseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdentificarseComponent],
    });
    fixture = TestBed.createComponent(IdentificarseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
