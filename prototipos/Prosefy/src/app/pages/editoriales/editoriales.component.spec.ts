import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { EditorialesComponent } from './editoriales.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { PopupLocalidadComponent } from '../../shared/popup-localidad/popup-localidad.component';
import { TodasLasEditorialesComponent } from '../../sections/todas-las-editoriales/todas-las-editoriales.component';

describe('EditorialesComponent', () => {
  let component: EditorialesComponent;
  let fixture: ComponentFixture<EditorialesComponent>;

  const fakeActivatedRoute = {
    snapshot: {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditorialesComponent, HeaderComponent, FooterComponent, NavbarComponent, PopupLocalidadComponent, TodasLasEditorialesComponent],
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      imports: [FormsModule, RouterModule]
    });
    fixture = TestBed.createComponent(EditorialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
