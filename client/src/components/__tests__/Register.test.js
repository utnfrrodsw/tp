import React from 'react';
import { render, cleanup,fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../usuario/register/Register.jsx';

describe('Registration Component', () => {
  afterEach(cleanup);

  test('renders the Registration component without errors', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // Ensure the component renders without errors
    const registerTitle = screen.getByText('Registro de Usuario');
    expect(registerTitle).toBeInTheDocument();
  });

  test('updates input field values on typing', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // Find input elements by their placeholder
    const nombreInput = screen.getByPlaceholderText('Nombre');
    const apellidoInput = screen.getByPlaceholderText('Apellido');
    const emailInput = screen.getByPlaceholderText('Email');
    const contraInput = screen.getByPlaceholderText('Contraseña');
    const contra2Input = screen.getByPlaceholderText('Confirmar Contraseña');
    const telefonoInput = screen.getByPlaceholderText('Número de Teléfono');
    const nacimientoInput = screen.getByPlaceholderText('Fecha de Nacimiento');

    // Simulate user input
    fireEvent.change(nombreInput, { target: { value: 'John' } });
    fireEvent.change(apellidoInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(contraInput, { target: { value: 'JD34647810' } });
    fireEvent.change(contra2Input, { target: { value: 'JD34647810' } });
    fireEvent.change(telefonoInput, { target: { value: '3464781021' } });
    fireEvent.change(nacimientoInput, { target: { value: '2001-03-11' } });

    // Ensure input field values update
    expect(nombreInput.value).toBe('John');
    expect(apellidoInput.value).toBe('Doe');
    expect(emailInput.value).toBe('john.doe@example.com');
    expect(contraInput.value).toBe('JD34647810');
    expect(contra2Input.value).toBe('JD34647810');
    expect(telefonoInput.value).toBe('3464781021');
    expect(nacimientoInput.value).toBe('2001-03-11');
  });

  test('adds a new address on button click', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // Find the button to open the address modal
    const addButton = screen.getByText('Agregar Dirección');

    // Simulate clicking the button to open the modal
    fireEvent.click(addButton);

    // Find input elements inside the modal
    const calleModalInput = screen.getByPlaceholderText('Calle');
    const numeroModalInput = screen.getByPlaceholderText('Número');
    const pisoInput = screen.getByPlaceholderText('Piso');
    const dptoInput = screen.getByPlaceholderText('Dpto');
    const codPostalModalInput = screen.getByPlaceholderText('Código Postal');
    const ciudadInput = screen.getByPlaceholderText('Ciudad');
    const provinciaInput = screen.getByPlaceholderText('Provincia');

    // Simulate user input in the modal
    fireEvent.change(calleModalInput, { target: { value: 'Nueva Calle' } });
    fireEvent.change(numeroModalInput, { target: { value: '123' } });
    fireEvent.change(pisoInput, { target: { value: '3' } });
    fireEvent.change(dptoInput, { target: { value: '4' } });
    fireEvent.change(codPostalModalInput, { target: { value: '12345' } });
    fireEvent.change(ciudadInput, { target: { value: 'Rosario' } });
    fireEvent.change(provinciaInput, { target: { value: 'Santa Fe' } });

    // Find the button to add the new address and click it
    const agregarDireccionButton = screen.getByText('Agregar');
    fireEvent.click(agregarDireccionButton);

    const addedAddressRegExp = /Calle: Nueva Calle, Número: 123, Piso: 3, Dpto: 4, CP: 12345/i;
    expect(screen.getByText(addedAddressRegExp)).toBeInTheDocument();
  });

  test('adds a new specialty after enabling the provider option', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // Find the switch to enable the provider option
    const prestadorSwitch = screen.getByText('Soy prestador');

    // Simulate clicking the switch to enable the provider option
    fireEvent.click(prestadorSwitch);

    // Find the button to open the specialty modal
    const addButton = screen.getByText('Agregar Especialidad');

    // Simulate clicking the button to open the modal
    fireEvent.click(addButton);

    // Find input elements inside the modal
    const nuevaEspecialidadInput = screen.getByPlaceholderText('Ej: Gasista');

    // Simulate user input in the modal
    fireEvent.change(nuevaEspecialidadInput, { target: { value: 'plomero' } });

    // Find the button to add the new specialty and click it
    const agregarEspecialidadButton = screen.getByText('Agregar');
    fireEvent.click(agregarEspecialidadButton);

    // Ensure the new specialty has been added
    const addedSpecialty = screen.getByText('plomero');
    expect(addedSpecialty).toBeInTheDocument();
  });

  test('tries to register a user with incorrect or missing data', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // Find the registration button
    const registroButton = screen.getByText('Registrarse');

    // Simulate clicking the registration button
    fireEvent.click(registroButton);

    // Wait for the registration response to be handled
    await waitFor(() => {
      expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
    });
  });


  //Para test 'registers a non-provider user', hay que fijarse que el usuario no haya sido registrado ya en la bd. Si es así, eliminarlo antes de testear 
  /*test('registers a non-provider user', async () => {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  // Find input elements by their placeholder
  const nombreInput = screen.getByPlaceholderText('Nombre');
  const apellidoInput = screen.getByPlaceholderText('Apellido');
  const emailInput = screen.getByPlaceholderText('Email');
  const contraInput = screen.getByPlaceholderText('Contraseña');
  const contra2Input = screen.getByPlaceholderText('Confirmar Contraseña');
  const telefonoInput = screen.getByPlaceholderText('Número de Teléfono');
  const nacimientoInput = screen.getByPlaceholderText('Fecha de Nacimiento');

  // Simulate user input
  fireEvent.change(nombreInput, { target: { value: 'John' } });
  fireEvent.change(apellidoInput, { target: { value: 'Doe' } });
  fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
  fireEvent.change(contraInput, { target: { value: 'JD34647810' } });
  fireEvent.change(contra2Input, { target: { value: 'JD34647810' } });
  fireEvent.change(telefonoInput, { target: { value: '346781021' } });
  fireEvent.change(nacimientoInput, { target: { value: '2001-03-11' } });

  // Ensure input field values update
  expect(nombreInput.value).toBe('John');
  expect(apellidoInput.value).toBe('Doe');
  expect(emailInput.value).toBe('john.doe@example.com');
  expect(contraInput.value).toBe('JD34647810');
  expect(contra2Input.value).toBe('JD34647810');
  expect(telefonoInput.value).toBe('346781021');
  expect(nacimientoInput.value).toBe('2001-03-11');

  // Find the registration button
  const registroButton = screen.getByText('Registrarse');

  // Simulate clicking the registration button
  fireEvent.click(registroButton);

  // Ensure there are no error messages
  expect(screen.queryByText('El email ingresado ya está en uso')).toBeNull();
  expect(screen.queryByText('Error during login')).toBeNull();
  expect(screen.queryByText('Error al conectar con el servidor')).toBeNull();

  await waitFor(() => {
    const successMessage = screen.queryByText('Registro exitoso');
    expect(successMessage).toBeInTheDocument();
  });
});*/ 

});
