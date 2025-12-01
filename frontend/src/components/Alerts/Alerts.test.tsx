import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert, AlertTitle, AlertDescription } from './Alerts.tsx';
import { describe, it, expect, vi } from 'vitest';

describe('Alert component', () => {
  it('Renderiza la Alerta con su titulo y su descripcion', () => {
    render(
      <Alert>
        <AlertTitle>Atencion!</AlertTitle>
        <AlertDescription>
          Este componente esta siendo testeado
        </AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();

    const title = screen.getByTestId('alert-title');
    expect(title.textContent).toBe('Atencion!');

    const description = screen.getByTestId('alert-description');
    expect(description.textContent).toBe(
      'Este componente esta siendo testeado'
    );
  });

  it('Llama al método de cierre cuando se clickea el boton', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Alert onClose={handleClose}>
        <AlertTitle>Error!</AlertTitle>
        <AlertDescription>
          Oh No!!!! Hubo un error. Pero lo estamos testeando😉
        </AlertDescription>
      </Alert>
    );

    const closeButton = screen.getByTestId('close-button');
    await user.click(closeButton);
    //tengo que esperar al delay de la animation xq sino da error
    await new Promise((r) => setTimeout(r, 350));
    expect(handleClose).toHaveBeenCalled();
  });

  it('Aplica los estilos correspondientes dependiendo de la variante', () => {
    // Danger variant
    const { container } = render(
      <Alert variant="danger">
        <AlertTitle>Ojo!</AlertTitle>
        <AlertDescription>Esto es una alerta danger</AlertDescription>
      </Alert>
    );
    expect(container.firstChild).toHaveClass(
      'text-destructive bg-red-200 text-red-900 border-red-400 [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90'
    );

    // Info variant
    const { container: containerInfo } = render(
      <Alert variant="info">
        <AlertTitle>Informacion!</AlertTitle>
        <AlertDescription>Esto tiene mucha infooo!!!</AlertDescription>
      </Alert>
    );
    expect(containerInfo.firstChild).toHaveClass(
      'bg-blue-200 text-blue-900 border-blue-400'
    );

    // Success variant
    const { container: containerSuccess } = render(
      <Alert variant="success">
        <AlertTitle>Exito!</AlertTitle>
        <AlertDescription>
          Esta alerta significa que todo salió bien
        </AlertDescription>
      </Alert>
    );
    expect(containerSuccess.firstChild).toHaveClass(
      'bg-green-200 text-green-900 border-green-400'
    );

    // Default variant
    const { container: containerDefault } = render(
      <Alert>
        <AlertTitle>Default!</AlertTitle>
        <AlertDescription>Alerta Default</AlertDescription>
      </Alert>
    );
    expect(containerDefault.firstChild).toHaveClass(
      'bg-gray-200 text-gray-900 border-gray-400'
    );
  });
  it('Cierra automaticamente la alerta despues de un tiempo si autoClose es true', async () => {
    // Usamos timers falsos para no tener que esperar el tiempo verdadero
    vi.useFakeTimers();

    const mockOnClose = vi.fn();

    render(
      <Alert autoClose={true} autoCloseDelay={2000} onClose={mockOnClose}>
        <AlertTitle>Auto Close!</AlertTitle>
        <AlertDescription>
          Esta alerta se cerrará automáticamente después de 2 segundos
        </AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    // Avanzamos el tiempo 3 segundos para compensar la animación
    vi.advanceTimersByTime(3000);

    // Verificamos si se llamó a onClose
    expect(mockOnClose).toHaveBeenCalled();

    // Cleanup
    vi.useRealTimers();
  });
});
