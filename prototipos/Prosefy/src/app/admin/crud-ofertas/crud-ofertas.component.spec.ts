import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudOfertasComponent } from './crud-ofertas.component';

describe('CrudOfertasComponent', () => {
  let component: CrudOfertasComponent;
  let fixture: ComponentFixture<CrudOfertasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrudOfertasComponent]
    });
    fixture = TestBed.createComponent(CrudOfertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
