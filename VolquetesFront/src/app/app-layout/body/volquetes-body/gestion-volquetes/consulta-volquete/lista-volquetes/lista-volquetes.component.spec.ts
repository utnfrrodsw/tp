import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaVolquetesComponent } from './lista-volquetes.component';

describe('ListaVolquetesComponent', () => {
  let component: ListaVolquetesComponent;
  let fixture: ComponentFixture<ListaVolquetesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaVolquetesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaVolquetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
