declare let window: any;

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutoresNuevosComponent } from './autores-nuevos.component';
import { AutoresService, Autor } from '../../services/autores.service';

describe('AutoresNuevosComponent', () => {
  let component: AutoresNuevosComponent;
  let fixture: ComponentFixture<AutoresNuevosComponent>;
  let autoresService: AutoresService;
  let mockAutores: Autor[];

  beforeEach(() => {
    mockAutores = [
      {
        id: 1,
        nombreCompleto: 'Nombre 1',
        perfil: '../../../../assets/img/Autores/Robert C. Martin.jpg',
        info: '...',
      },
      {
        id: 2,
        nombreCompleto: 'Nombre 2',
        perfil: '../../../../assets/img/Autores/James Clear.png',
        info: '...',
      },
      {
        id: 3,
        nombreCompleto: 'Nombre 3',
        perfil: '../../../../assets/img/Autores/James Clear.png',
        info: '...',
      },
      {
        id: 4,
        nombreCompleto: 'Nombre 4',
        perfil: '../../../../assets/img/Autores/James Clear.png',
        info: '...',
      },
      {
        id: 5,
        nombreCompleto: 'Nombre 5',
        perfil: '../../../../assets/img/Autores/James Clear.png',
        info: '...',
      },
      {
        id: 6,
        nombreCompleto: 'Nombre 6',
        perfil: '../../../../assets/img/Autores/James Clear.png',
        info: '...',
      },
      {
        id: 7,
        nombreCompleto: 'Nombre 7',
        perfil: '../../../../assets/img/Autores/James Clear.png',
        info: '...',
      },
      {
        id: 8,
        nombreCompleto: 'Nombre 8',
        perfil: '../../../../assets/img/Autores/James Clear.png',
        info: '...',
      },
      {
        id: 9,
        nombreCompleto: 'Nombre 9',
        perfil: '../../../../assets/img/Autores/James Clear.png',
        info: '...',
      },
      {
        id: 10,
        nombreCompleto: 'Nombre 10',
        perfil: '../../../../assets/img/Autores/James Clear.png',
        info: '...',
      },
    ];

    TestBed.configureTestingModule({
      declarations: [AutoresNuevosComponent],
      providers: [AutoresService],
    });
    fixture = TestBed.createComponent(AutoresNuevosComponent);
    component = fixture.componentInstance;
    autoresService = TestBed.inject(AutoresService);
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('debería inicializar los autores en ngOnInit', () => {
    spyOn(autoresService, 'getAutores').and.returnValue(mockAutores);
    component.ngOnInit();
    expect(component.autores).toEqual(mockAutores);
  });


  it('debería moverse hacia la izquierda y actualizar elementoActual y visibilidad', () => {
    component.autores = mockAutores;
    component.elementoActual = 8;
    component.elementosPorPaso = 8;
    component.moverIzquierda();
    expect(component.elementoActual).toEqual(0);
    expect(component.elementosAlInicio).toBeTruthy();
    expect(component.elementosAlFinal).toBeFalsy();
  });


  it('debería moverse hacia la derecha y actualizar elementoActual y visibilidad', () => {
    component.autores = mockAutores;
    component.elementoActual = 0;
    component.elementosPorPaso = 8;
    component.moverDerecha();
    expect(component.elementoActual).toEqual(8);
    expect(component.elementosAlInicio).toBeFalsy();
    expect(component.elementosAlFinal).toBeTruthy();
  });


  it('debería actualizar elementosPorPaso y elementoActual al cambiar el tamaño de la ventana', () => {
    const smallScreenWidth = 500;
    const largeScreenWidth = 1200;
    window.innerWidth = smallScreenWidth;
    component.onResize({} as Event);
    expect(component.elementosPorPaso).toEqual(2);

    window.innerWidth = largeScreenWidth;
    component.onResize({} as Event);
    expect(component.elementosPorPaso).toEqual(8);

    // Prueba el escenario donde es necesario ajustar elementoActual
    component.autores = mockAutores; // Usa el mock de autores
    component.elementoActual = 10; // Valor inicial de ejemplo
    component.elementosPorPaso = 8; // Valor inicial de ejemplo
    component.onResize({} as Event);
    expect(component.elementoActual).toEqual(component.autores.length - component.elementosPorPaso);
  });
});
