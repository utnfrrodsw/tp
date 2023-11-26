import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelAdminComponent } from './panel-admin.component';

describe('PanelAdminComponent', () => {
  let component: PanelAdminComponent;
  let fixture: ComponentFixture<PanelAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanelAdminComponent]
    });
    fixture = TestBed.createComponent(PanelAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
