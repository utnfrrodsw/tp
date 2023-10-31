import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorialesComponent } from './editoriales.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { PopupLocalidadComponent } from '../../shared/popup-localidad/popup-localidad.component';

describe('EditorialesComponent', () => {
  let component: EditorialesComponent;
  let fixture: ComponentFixture<EditorialesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditorialesComponent, HeaderComponent, FooterComponent, NavbarComponent, PopupLocalidadComponent]
    });
    fixture = TestBed.createComponent(EditorialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
