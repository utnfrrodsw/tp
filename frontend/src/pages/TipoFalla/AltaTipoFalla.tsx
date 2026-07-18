import AltaForm from "./../CRUDS/Alta/AltaForm";
import type { FieldConfig } from "./../CRUDS/Alta/AltaForm";
import { EVENTS } from '../../lib/eventBus';

const FIELDS: FieldConfig[] = [
  {
    name: 'failureDescription',
    label: 'Descripción',
    type: 'text',
    placeholder: 'Ej: Pantalla rota, batería defectuosa...',
    required: true,
    minLength: 3,
  },
  {
    name: 'estimatedImport',
    label: 'Importe Estimado',
    type: 'number',
    placeholder: '0.00',
    required: true,
    prefix: '$',
    min: 0,
    step: 0.01,
  },
];

const ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

interface AltaTipoFallaProps {
  onSuccess?: () => void;
}

export default function AltaTipoFalla({ onSuccess }: AltaTipoFallaProps) {
  return (
    <AltaForm
      title="Nuevo Tipo de Falla"
      subtitle="Completá los datos para registrar el tipo"
      icon={ICON}
      fields={FIELDS}
      endpoint="/failures/createTypeFail"
      submitLabel="Crear Tipo de Falla"
      successMessage="Tipo de falla creado correctamente."
      entityEvent={EVENTS.failureTypeChanged}
      onSuccess={onSuccess}
    />
  );
}