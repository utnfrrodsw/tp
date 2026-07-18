import BajaForm from "./../CRUDS/Baja/BajaForm";
import type { DetailFieldConfig } from "./../CRUDS/Baja/BajaForm";
import { EVENTS } from '../../lib/eventBus';

interface PaymentType {
    id_payment_type: number;
    paymentMethod: string;
    paymentTypeName: string;
    type_of_payment: string;
    percentaje: number;
}

const FIELDS: DetailFieldConfig[] = [
    {
        name: 'paymentTypeName',
        label: 'Nombre del Tipo de Pago',
    },
    {
        name: 'paymentMethod',
        label: 'Método de Pago',
    },
    {
        name: 'type_of_payment',
        label: 'Tipo de Pago',
    },
    {
        name: 'percentaje',
        label: 'Porcentaje',
        format: (value) => `${(Number(value)*100).toLocaleString('es-AR')}%`,
    },
];
const ICON = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
interface DeletePaymentTypeProps {
    onSuccess?: () => void;
}
export default function DeletePaymentType({ onSuccess }: DeletePaymentTypeProps) {
    return (
        <BajaForm<PaymentType>
            title="Eliminar Tipo de Pago"
            subtitle="Buscá el tipo de pago que querés eliminar"
            searchPlaceholder="Busca tu tipo de pago por nombre..."
            searchEndpoint="/payments/getPartialTypesPayment"
            deleteEndpoint="/payments/deleteTypePayment"
            entityEvent={EVENTS.paymentTypeChanged}
            successMessage="Tipo de pago eliminado correctamente."
            icon={ICON}
            detailFields={FIELDS}
            idField="id_payment_type"
            previewField="paymentTypeName"
            onSuccess={onSuccess}
        />
    );
}