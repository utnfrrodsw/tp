import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDetalladaLibroComponent } from './info-detallada-libro.component';

describe('InfoDetalladaLibroComponent', () => {
  let component: InfoDetalladaLibroComponent;
  let fixture: ComponentFixture<InfoDetalladaLibroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoDetalladaLibroComponent]
    });
    fixture = TestBed.createComponent(InfoDetalladaLibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
