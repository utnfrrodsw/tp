import React from 'react';
import { render, fireEvent, screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../usuario/register/Register.jsx';

describe('Componente de Registro', () => {
  test('renderiza el componente de Registro sin errores', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // Asegura que el componente se renderice sin errores
    const registerTitle = screen.getByText('Registro de Usuario');
    expect(registerTitle).toBeInTheDocument();
  });

  test('actualiza los valores de los campos de entrada al escribir', () => {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  // Encuentra los elementos de entrada por su marcador de posición
  const nombreInput = screen.getByPlaceholderText('Nombre');
  const apellidoInput = screen.getByPlaceholderText('Apellido');
  const emailInput = screen.getByPlaceholderText('Email');
  const contraInput = screen.getByPlaceholderText('Contraseña');
  const contra2Input = screen.getByPlaceholderText('Confirmar Contraseña');
  const telefonoInput = screen.getByPlaceholderText('Número de Teléfono');
  const nacimientoInput = screen.getByPlaceholderText('Fecha de Nacimiento');

  // Simula la entrada del usuario
  fireEvent.change(nombreInput, { target: { value: 'John' } });
  fireEvent.change(apellidoInput, { target: { value: 'Doe' } });
  fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
  fireEvent.change(contraInput, { target: { value: 'JD34647810' } });
  fireEvent.change(contra2Input, { target: { value: 'JD34647810' } });
  fireEvent.change(telefonoInput, { target: { value: '3464781021' } });
  fireEvent.change(nacimientoInput, { target: { value: '2001-03-11' } });

  // Asegura que los valores de los campos se actualicen
  expect(nombreInput.value).toBe('John');
  expect(apellidoInput.value).toBe('Doe');
  expect(emailInput.value).toBe('john.doe@example.com');
  expect(contraInput.value).toBe('JD34647810');
  expect(contra2Input.value).toBe('JD34647810');
  expect(telefonoInput.value).toBe('3464781021');
  expect(nacimientoInput.value).toBe('2001-03-11');
  });


  test('agrega una nueva dirección al hacer clic en el botón', () => {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  // Encuentra el botón para abrir el modal de dirección
  const addButton = screen.getByText('Agregar Dirección');

  // Simula hacer clic en el botón para abrir el modal
  fireEvent.click(addButton);

  // Encuentra los elementos de entrada dentro del modal
  const calleModalInput = screen.getByPlaceholderText('Calle');
  const numeroModalInput = screen.getByPlaceholderText('Número');
  const pisoInput = screen.getByPlaceholderText('Piso');
  const dptoInput = screen.getByPlaceholderText('Dpto');
  const codPostalModalInput = screen.getByPlaceholderText('Código Postal');
  const ciudadInput = screen.getByPlaceholderText('Ciudad');
  const provinciaInput = screen.getByPlaceholderText('Provincia');
  
  // Simula la entrada del usuario en el modal
  fireEvent.change(calleModalInput, { target: { value: 'Nueva Calle' } });
  fireEvent.change(numeroModalInput, { target: { value: '123' } });
  fireEvent.change(pisoInput, { target: { value: '3' } });
  fireEvent.change(dptoInput, { target: { value: '4' } });
  fireEvent.change(codPostalModalInput, { target: { value: '12345' } });
  fireEvent.change(ciudadInput, { target: { value: 'Rosario' } });
  fireEvent.change(provinciaInput, { target: { value: 'Santa Fe' } });

  // Encuentra el botón para agregar la nueva dirección y haz clic en él
  const agregarDireccionButton = screen.getByText('Agregar');
  fireEvent.click(agregarDireccionButton);

  
  const addedAddressRegExp = /Calle: Nueva Calle, Número: 123, Piso: 3, Dpto: 4, CP: 12345/i;
  expect(screen.getByText(addedAddressRegExp)).toBeInTheDocument();
  });


  test('agrega una nueva especialidad después de activar la opción de ser prestador', () => {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  // Encuentra el interruptor para activar la opción de ser prestador
  const prestadorSwitch = screen.getByText('Soy prestador');

  // Simula hacer clic en el interruptor para activar la opción de ser prestador
  fireEvent.click(prestadorSwitch);

  // Encuentra el botón para abrir el modal de especialidad
  const addButton = screen.getByText('Agregar Especialidad');

  // Simula hacer clic en el botón para abrir el modal
  fireEvent.click(addButton);

  // Encuentra los elementos de entrada dentro del modal
  const nuevaEspecialidadInput = screen.getByPlaceholderText('Ej: Gasista');

  // Simula la entrada del usuario en el modal
  fireEvent.change(nuevaEspecialidadInput, { target: { value: 'plomero' } });

  // Encuentra el botón para agregar la nueva especialidad y haz clic en él
  const agregarEspecialidadButton = screen.getByText('Agregar');
  fireEvent.click(agregarEspecialidadButton);

  // Asegura que la nueva especialidad se haya agregado
  const addedSpecialty = screen.getByText('plomero');
  expect(addedSpecialty).toBeInTheDocument();
  });

});
