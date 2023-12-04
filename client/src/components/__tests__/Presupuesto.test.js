import React from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Presupuesto from '../prestador/presupuesto/Presupuesto';

describe('Componente Presupuesto', () => {
  test('renders Presupuesto component', () => {
    render(
      <MemoryRouter>
      <Presupuesto />
      </MemoryRouter>);
    // Agrega aserciones basadas en el renderizado inicial de tu componente
  });


  test('submits Presupuesto form with incomplete date and time data', async () => {
  render(
    <MemoryRouter>
      <Presupuesto />
    </MemoryRouter>
  );
  
  // Llenar algunos campos, pero no seleccionar fecha y hora
  fireEvent.change(screen.getByTestId('listaMateriales-input'), { target: { value: 'Material 1, Material 2' } });
  fireEvent.change(screen.getByTestId('costoMateriales-input'), { target: { value: '100' } });
  fireEvent.change(screen.getByTestId('tiempo-input'), { target: { value: '5' } });
  fireEvent.change(screen.getByTestId('costoHora-input'), { target: { value: '20' } });

  // Intentar enviar el formulario
  fireEvent.click(screen.getByText('Enviar Presupuesto'));
  
  // Asegurarse de que se muestren los mensajes de error por no seleccionar fecha y hora
  await waitFor(() => {
    expect(screen.getByText('Debes seleccionar al menos una fecha y hora.')).toBeInTheDocument();
  });
});


});
