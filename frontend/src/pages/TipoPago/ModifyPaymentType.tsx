import ModForm from '../CRUDS/Modify/ModForm';
import type { FieldConfig } from '../CRUDS/Alta/AltaForm';
import { EVENTS } from '../../lib/eventBus';

interface PaymentType {
  id_payment_type: number;
  paymentTypeName: string;
  percentaje: number;
  paymentMethod: 'EFECTIVO' | 'CREDITO' | 'DEBITO' | 'MP';
  type_of_payment: 'Descuento' | 'Recargo';
}
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

interface ModifyPaymentTypeProps {
  onSuccess?: () => void;
}

export default function ModifyPaymentType({ onSuccess }: ModifyPaymentTypeProps) {
  return (
    <ModForm<PaymentType>
        title="Modificar Tipo de Pago"
        subtitle="Buscá el tipo de pago que querés editar"
        searchPlaceholder="Buscar tipo de pago..."
        searchEndpoint="/payments/getPartialTypesPayment"
        modifyEndpoint="/payments/modifyTypePayment"
        idField="id_payment_type"
        previewField="paymentTypeName"
        icon={ICON}
        fields={FIELDS}
        entityEvent={EVENTS.paymentTypeChanged}
        successMessage="Tipo de pago modificado correctamente."
        onSuccess={onSuccess}
    />
  );
}   