import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertasDestacadasComponent } from './ofertas-destacadas.component';

describe('OfertasDestacadasComponent', () => {
  let component: OfertasDestacadasComponent;
  let fixture: ComponentFixture<OfertasDestacadasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfertasDestacadasComponent],
    });
    fixture = TestBed.createComponent(OfertasDestacadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
