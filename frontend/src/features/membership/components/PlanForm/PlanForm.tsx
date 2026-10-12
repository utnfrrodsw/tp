// Formulario del panel de administración para cambiar el precio de un plan pago,
// que es lo único editable de un plan. Es controlado y no guarda nada: delega el
// submit al padre (PlanAdminSection).
//
// El monto se maneja como texto y no como número por la misma razón por la que
// existe NumberInput: un <input type="number"> cambia el valor solo si se lo
// scrollea sin querer, y acá eso sería cambiarle el precio a un plan. La
// conversión a número se hace una sola vez, al enviar.
//
// Valida con reglas propias (core/utils/validators) y no con las del navegador.
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../../../../core/components/Button';
import { FormField, TextInput } from '../../../../core/components/FormField';
import {
  fieldErrorProps,
  isNumberBetween,
  required,
  validateField,
} from '../../../../core/utils/validators';
import './PlanForm.scss';

type PlanFormProps = {
  /**
   * Precio con el que arranca el campo, como texto ("3500", "1750.50"). Se lee
   * una sola vez, al montar: el padre remonta el formulario con una `key`
   * distinta cuando cambia de plan.
   */
  initialAmount: string;
  isSubmitting: boolean;
  /** Recibe el precio nuevo ya como número. */
  onSubmit: (amount: number) => Promise<boolean>;
  onCancel: () => void;
};

/**
 * Valida el precio con las mismas reglas que plan.schema.ts del backend: mayor a
 * cero (el plan pago no puede quedar gratis) y dentro de lo que entra en la
 * columna DECIMAL(10,2).
 */
function validateAmount(amount: string): string | undefined {
  return validateField(amount, [
    required('Ingresá el precio del plan.'),
    isNumberBetween(
      0.01,
      99999999.99,
      'El monto tiene que ser mayor a cero y como máximo 99.999.999,99.'
    ),
  ]);
}

/**
 * Deja pasar solo lo que puede formar un precio: dígitos y un único punto
 * decimal, con dos decimales como máximo. Es el mismo límite que valida el
 * backend, que guarda el monto en un DECIMAL(10,2).
 *
 * @param raw lo que hay escrito en el campo después de la última tecla.
 * @returns el texto ya filtrado, listo para volver al campo.
 */
function filterAmount(raw: string): string {
  // La coma es lo que se escribe naturalmente en español para separar decimales,
  // así que se acepta y se traduce, en vez de descartar la tecla en silencio.
  const normalized = raw.replace(',', '.').replace(/[^0-9.]/g, '');

  const [whole, ...rest] = normalized.split('.');
  if (rest.length === 0) return whole;

  // Todo lo que venga después del primer punto es la parte decimal: si el usuario
  // escribió dos puntos, el segundo se descarta en lugar de partir el número.
  return `${whole}.${rest.join('').slice(0, 2)}`;
}

export const PlanForm = ({ initialAmount, isSubmitting, onSubmit, onCancel }: PlanFormProps) => {
  const [amount, setAmount] = useState(initialAmount);
  // Errores visibles recién después del primer intento de guardar; desde ahí se
  // recalculan en cada tecla.
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const error = wasSubmitted ? validateAmount(amount) : undefined;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setWasSubmitted(true);
    if (validateAmount(amount)) return;

    // La validación ya garantizó que hay un número válido.
    await onSubmit(Number(amount));
  };

  return (
    <form className="plan-form" onSubmit={handleSubmit} noValidate>
      <FormField id="plan-amount" label="Precio del pago único" hint="(en pesos)" error={error}>
        <TextInput
          id="plan-amount"
          type="text"
          inputMode="decimal"
          placeholder="3500"
          value={amount}
          onChange={(e) => setAmount(filterAmount(e.target.value))}
          {...fieldErrorProps('plan-amount', error)}
        />
      </FormField>

      <div className="plan-form__actions">
        <Button variant="subtle" disabled={isSubmitting} onClick={onCancel}>
          Cancelar
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar precio'}
        </Button>
      </div>
    </form>
  );
};
