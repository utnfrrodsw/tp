import AltaForm from './../CRUDS/Alta/AltaForm';
import type { FieldConfig } from './../CRUDS/Alta/AltaForm';
import { EVENTS } from '../../lib/eventBus';

const PAYMENT_OPTIONS = [
  { value: 'DEBITO',  label: 'Débito' },
  { value: 'MP',      label: 'Mercado Pago' },
  { value: 'EFECTIVO', label: 'Efectivo' },
  { value: 'CREDITO', label: 'Crédito' },
];

const PAYMENT_TYPE_OPTIONS = [
  { value: 'Descuento', label: 'Descuento' },
  { value: 'Recargo',   label: 'Recargo' },
];

const FIELDS: FieldConfig[] = [
    {
        name: 'paymentTypeName',
        label: 'Nombre del Tipo de Pago',
        type: 'text',
        required: true,
        placeholder: 'Ej: 6 cuotas sin interes con tarjeta de crédito',
    },
    {
        name: 'paymentMethod',
        label: 'Método de Pago',
        type: 'select',
        options: PAYMENT_OPTIONS,
        required: true,
        placeholder: 'Seleccioná un método de pago',
    },
    {
        name: 'type_of_payment',
        label: 'Tipo de Pago',
        type: 'select',
        options: PAYMENT_TYPE_OPTIONS,
        required: true,
        placeholder: 'Seleccioná un tipo de pago',
    },
    {
        name: 'percentaje',
        label: 'Porcentaje',
        type: 'number',
        placeholder: 'Ej: 0.1 para 10%',
        required: true,
        min: 0,
    },

];

const ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

interface RegisterPaymentTypeProps {
  onSuccess?: () => void;
}

export default function RegisterPaymentType({ onSuccess }: RegisterPaymentTypeProps) {
    return(
        <AltaForm
            title="Nuevo Tipo de Pago"
            subtitle="Completá los datos para registrar el tipo de pago"
            icon={ICON}
            fields={FIELDS}
            endpoint="/payments/createTypePayment"
            submitLabel="Crear Tipo de Pago"
            successMessage="Tipo de pago creado correctamente."
            entityEvent={EVENTS.paymentTypeChanged}
            onSuccess={onSuccess}/>
    )
};