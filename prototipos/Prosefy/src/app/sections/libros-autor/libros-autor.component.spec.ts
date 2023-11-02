import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { LibrosAutorComponent } from './libros-autor.component';
import { LibrosService, Libro } from '../../services/libros.service';
import { CurrencyService } from '../../services/currency.service';
import { AutoresService, Autor } from '../../services/autores.service';

describe('LibrosAutorComponent', () => {
  let component: LibrosAutorComponent;
  let fixture: ComponentFixture<LibrosAutorComponent>;
  let librosService: LibrosService;
  let currencyService: CurrencyService;
  let autoresService: AutoresService;
  let mockAutores: Autor[];

  beforeEach(() => {

    mockAutores = [
      {
        id: 1,
        nombreCompleto: 'Nombre 1',
        perfil: 'perfil1.jpg',
        info: '...',
      },
      {
        id: 2,
        nombreCompleto: 'Nombre 2',
        perfil: 'perfil1.jpg',
        info: '...',
      },]


    TestBed.configureTestingModule({
      declarations: [LibrosAutorComponent],
      providers: [LibrosService, CurrencyService, AutoresService, DatePipe, { provide: ActivatedRoute, useValue: {} }],
      imports: [CommonModule, RouterModule]
    });
    fixture = TestBed.createComponent(LibrosAutorComponent);
    component = fixture.componentInstance;
    librosService = TestBed.inject(LibrosService);
    currencyService = TestBed.inject(CurrencyService);
    autoresService = TestBed.inject(AutoresService);
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('debe inicializar el componente', () => {
    expect(component.currentPage).toEqual(1);
    expect(component.itemsPerPage).toEqual(4);
    expect(component.showMore).toBeFalsy();
    expect(component.deseos).toEqual({});
    expect(component.pulsateStates).toEqual({});
  });


  it('debe calcular el precio en la moneda seleccionada', () => {
    const mockPrice = 100;
    spyOn(currencyService, 'calculatePriceInSelectedCurrency').and.returnValue(80);
    const result = component.calculatePriceInSelectedCurrency(mockPrice);
    expect(result).toEqual(80);
  });


  it('debería marcar el libro en la lista de deseos', () => {
    const libro = { id: 1 };
    component.toggleDeseo(libro);
    // TODO: Agregar las expectativas apropiadas para el estado de deseos y pulsateStates
  });


  it('debería comprobar si un libro está en lista de deseos', () => {
    // Prueba para verificar si un libro está en deseos
    const libro = { id: 1 };
    // Agregar un libro a deseos antes de ejecutar la prueba
    component.toggleDeseo(libro);
    const isInDeseos = component.isInDeseos(libro);
    // TODO: Agregar las expectativas apropiadas para isInDeseos
  });


  it('no debe acortar la información del autor si "mostrar más" es verdadero', () => {
    // Prueba para no acortar la información del autor si "mostrar más" es verdadero
    // Agregar un autor con información larga al componente antes de ejecutar la prueba
    const autorPrueba: Autor = {
      id: 1,
      nombreCompleto: 'Nombre Apellido',
      perfil: 'ruta/de/imagen.jpg',
      info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus feugiat sapien velit, at luctus est aliquam vel. Sed id lacus vitae orci lobortis scelerisque. Nulla posuere, ligula sed lacinia interdum, quam metus convallis libero, vel eleifend leo velit et nisi. Sed facilisis vestibulum placerat. Duis sed magna et ipsum blandit tincidunt. Sed ullamcorper pellentesque orci, a feugiat lacus viverra in. Proin ultricies metus et congue pellentesque. Maecenas at neque quis lorem fringilla luctus in sed leo. Vivamus ullamcorper ipsum id lacus commodo, et congue tellus fermentum.',
    };
    component.showMore = true;
    const shortenedInfo = component.getShortenedInfo(autorPrueba);
    expect(shortenedInfo).toEqual(autorPrueba.info);
  });


});
