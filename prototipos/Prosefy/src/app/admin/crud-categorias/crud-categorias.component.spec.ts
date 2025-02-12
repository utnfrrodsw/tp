/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CrudCategoriasComponent } from './crud-categorias.component';

describe('CrudCategoriasComponent', () => {
  let component: CrudCategoriasComponent;
  let fixture: ComponentFixture<CrudCategoriasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudCategoriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
