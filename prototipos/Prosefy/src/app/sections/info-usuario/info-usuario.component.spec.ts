import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUsuarioComponent } from './info-usuario.component';

describe('InfoUsuarioComponent', () => {
  let component: InfoUsuarioComponent;
  let fixture: ComponentFixture<InfoUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoUsuarioComponent]
    });
    fixture = TestBed.createComponent(InfoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
