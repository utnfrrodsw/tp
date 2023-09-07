import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeadernavComponent } from './headernav.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [HeadernavComponent],
})
class TestModule {}

describe('HeadernavComponent', () => {
  let component: HeadernavComponent;
  let fixture: ComponentFixture<HeadernavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule], // Importa el módulo de prueba que incluye las declaraciones
    });
    fixture = TestBed.createComponent(HeadernavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
