import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import NuevaSolicitud from '../cliente/nuevaSolicitud/NuevaSolicitud';

describe('Componente Nueva Solicitud',()=>{
  /*test('renders NuevaSolicitud component', () => {
  render(<NuevaSolicitud hendleSolicitudesUpdate={() => {}} />);
  // Add assertions based on your component's initial render
});
*/
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


test('submits form with valid data', async () => {
  const hendleSolicitudesUpdateMock = jest.fn();
  render(<NuevaSolicitud hendleSolicitudesUpdate={hendleSolicitudesUpdateMock} />);

  fireEvent.click(screen.getByText('+')); // Open the modal

  // Fill out the form with valid data
  fireEvent.change(screen.getByTestId('titulo-input'), { target: { value: 'Test Title' } });
  fireEvent.change(screen.getByTestId('descripcion-input'), { target: { value: 'Test Description' } });
  fireEvent.change(screen.getByTestId('profesion-input'), { target: { value: '1' } });
  fireEvent.change(screen.getByTestId('direccion-input'), { target: { value: '1' } });

  const fileInput = screen.getByTestId('fotos-input');
  const file1 = new File(['file content'], 'file1.jpg', { type: 'image/jpeg' });
  const file2 = new File(['file content'], 'file2.jpg', { type: 'image/jpeg' });
  fireEvent.change(fileInput, { target: { files: [file1, file2] } });

  fireEvent.click(screen.getByText('Enviar'));

  // Wait for the component to handle the submission and update state
  await waitFor(() => {
    //expect(hendleSolicitudesUpdateMock).toHaveBeenCalled();
    expect(screen.queryByText('Nueva Solicitud')).not.toBeInTheDocument();
  });
});


});