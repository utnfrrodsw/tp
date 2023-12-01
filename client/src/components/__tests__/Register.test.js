import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Register from '../usuario/register/Register.jsx';

describe('Register component', () => {
  test('renders Register component without errors', () => {
    render(<Register />);
    
    // Assert that the component renders without errors
    const registerTitle = screen.getByText('Registro de Usuario');
    expect(registerTitle).toBeInTheDocument();
  });

  test('updates input values on user input', () => {
    render(<Register />);
    
    // Find the input elements by their placeholders
    const nombreInput = screen.getByPlaceholderText('Nombre');
    const apellidoInput = screen.getByPlaceholderText('Apellido');
    const emailInput = screen.getByPlaceholderText('Email');
    
    // Simulate user input
    fireEvent.change(nombreInput, { target: { value: 'John' } });
    fireEvent.change(apellidoInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });

    // Assert that input values are updated
    expect(nombreInput.value).toBe('John');
    expect(apellidoInput.value).toBe('Doe');
    expect(emailInput.value).toBe('john.doe@example.com');
  });
  test('adds a new address on button click', () => {
    render(<Register />);
    
    // Find the button to open the address modal
    const addButton = screen.getByText('Agregar Dirección');

    // Simulate clicking the button to open the modal
    fireEvent.click(addButton);

    // Find the input elements within the modal
    const calleModalInput = screen.getByPlaceholderText('Calle');
    const numeroModalInput = screen.getByPlaceholderText('Número');
    const codPostalModalInput = screen.getByPlaceholderText('Código Postal');

    // Simulate user input in the modal
    fireEvent.change(calleModalInput, { target: { value: 'New Street' } });
    fireEvent.change(numeroModalInput, { target: { value: '123' } });
    fireEvent.change(codPostalModalInput, { target: { value: '12345' } });

    // Find the button to add the new address and click it
    const agregarDireccionButton = screen.getByText('Agregar');
    fireEvent.click(agregarDireccionButton);

    // Assert that the new address is added
    const addedAddress = screen.getByText('Calle: New Street, Número: 123, Código Postal: 12345');
    expect(addedAddress).toBeInTheDocument();
  });

  // You can add more tests for other state changes and interactions
});
