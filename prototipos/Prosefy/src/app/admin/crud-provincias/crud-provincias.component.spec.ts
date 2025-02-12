/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CrudProvinciasComponent } from './crud-provincias.component';

describe('CrudProvinciasComponent', () => {
  let component: CrudProvinciasComponent;
  let fixture: ComponentFixture<CrudProvinciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudProvinciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudProvinciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
