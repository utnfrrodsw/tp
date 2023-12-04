import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NuevaSolicitud from '../cliente/nuevaSolicitud/NuevaSolicitud';

describe('Componente Nueva Solicitud',()=>{
  test('renders NuevaSolicitud component', () => {
  render(<NuevaSolicitud hendleSolicitudesUpdate={() => {}} />);
  // Add assertions based on your component's initial render
});

test('opens and closes modal on button click', async () => {
  render(<NuevaSolicitud hendleSolicitudesUpdate={() => {}} />);
  
  // Click the floating button to open the modal
  fireEvent.click(screen.getByText('+'));
  expect(screen.getByText('Nueva Solicitud')).toBeInTheDocument();

  // Click the close button to close the modal
  fireEvent.click(screen.getByText('Cerrar'));
  await waitFor(() => {
    expect(screen.queryByText('Nueva Solicitud')).not.toBeInTheDocument();
  });
});

test('shows error messages when required fields are not filled', async () => {
  render(<NuevaSolicitud hendleSolicitudesUpdate={() => {}} />);

  fireEvent.click(screen.getByText('+')); // Open the modal

  fireEvent.click(screen.getByText('Enviar'));

  // Espera a que se muestren los mensajes de error para cada campo
  await waitFor(() => {
    expect(screen.getByText('El titulo es requerido')).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText('La descripcion es requerida')).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText('La profesion es requerida')).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText('La direccion es requerida')).toBeInTheDocument();
  });



  // Asegúrate de que la función hendleSolicitudesUpdate no se haya llamado
  expect(screen.queryByText('Enviando...')).toBeNull();
});

});