// Test unitario del formulario de precio de un plan del panel de administración.
//
// Prueba la validación propia: con un precio inválido el formulario muestra el
// mensaje y NO llama a onSubmit (no gasta una request); con uno válido sí, y con
// el monto ya convertido a número.
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { PlanForm } from './PlanForm';

const AMOUNT_ERROR = 'El monto tiene que ser mayor a cero y como máximo 99.999.999,99.';

/** Monta el formulario con el precio inicial indicado. */
function renderForm(initialAmount: string, onSubmit = vi.fn().mockResolvedValue(true)) {
  render(
    <PlanForm
      initialAmount={initialAmount}
      isSubmitting={false}
      onSubmit={onSubmit}
      onCancel={vi.fn()}
    />
  );
  return onSubmit;
}

describe('PlanForm', () => {
  it('vacío muestra el error del precio sin llamar a onSubmit', () => {
    const onSubmit = renderForm('');

    fireEvent.click(screen.getByRole('button', { name: 'Guardar precio' }));

    expect(screen.getByText('Ingresá el precio del plan.')).toBeInTheDocument();
    expect(screen.getByLabelText(/Precio/)).toHaveAttribute('aria-invalid', 'true');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('rechaza un precio de cero: el plan pago no puede quedar gratis', () => {
    const onSubmit = renderForm('0');

    fireEvent.click(screen.getByRole('button', { name: 'Guardar precio' }));

    expect(screen.getByText(AMOUNT_ERROR)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('no muestra errores antes del primer intento de guardar', () => {
    renderForm('');

    expect(screen.queryByText('Ingresá el precio del plan.')).not.toBeInTheDocument();
  });

  it('con un precio válido llama a onSubmit con el monto como número', () => {
    const onSubmit = renderForm('3500');

    // La coma se acepta y se traduce a punto, como escribe un monto un argentino.
    fireEvent.change(screen.getByLabelText(/Precio/), { target: { value: '4200,50' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar precio' }));

    expect(onSubmit).toHaveBeenCalledWith(4200.5);
  });
});
