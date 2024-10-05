import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoVolquetesListComponent } from './tipo-volquetes-list.component';

describe('TipoVolquetesListComponent', () => {
  let component: TipoVolquetesListComponent;
  let fixture: ComponentFixture<TipoVolquetesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoVolquetesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoVolquetesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
