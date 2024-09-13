import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilClienteComponent } from './perfil-cliente.component';

describe('PerfilClienteComponent', () => {
  let component: PerfilClienteComponent;
  let fixture: ComponentFixture<PerfilClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfilClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerfilClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
