import BajaForm from "./../CRUDS/Baja/BajaForm";
import type { DetailFieldConfig } from "./../CRUDS/Baja/BajaForm";
import { EVENTS } from '../../lib/eventBus';

interface FailureType {
  id_failure_type: number;
  failureDescription: string;
  estimatedImport: number;
}

const FIELDS: DetailFieldConfig[] = [
  {
    name: 'failureDescription',
    label: 'Descripción',
  },
  {
    name: 'estimatedImport',
    label: 'Importe Estimado',
    format: (value) => `$${Number(value).toLocaleString('es-AR')}`,
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

interface BajaTipoFallaProps {
  onSuccess?: () => void;
}

export default function BajaTipoFalla({ onSuccess }: BajaTipoFallaProps) {
  return (
    <BajaForm<FailureType>
      title="Eliminar Tipo de Falla"
      subtitle="Buscá el tipo de falla que querés eliminar"
      searchPlaceholder="Busca tu falla por descripción..."
      searchEndpoint="/failures/getPartialTypes"
      deleteEndpoint="/failures/deleteType"
      entityEvent={EVENTS.failureTypeChanged}
      successMessage="Tipo de falla eliminado correctamente."
      icon={ICON}
      detailFields={FIELDS}
      idField="id_failure_type"
      previewField="failureDescription"
      onSuccess={onSuccess}
    />
  );
}