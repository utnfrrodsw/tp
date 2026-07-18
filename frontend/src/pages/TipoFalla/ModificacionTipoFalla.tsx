import ModForm from './../CRUDS/Modify/ModForm';
import type { FieldConfig } from './../CRUDS/Alta/AltaForm';
import { EVENTS } from '../../lib/eventBus';

interface FailureType {
  id_failure_type: number;
  failureDescription: string;
  estimatedImport: number;
}

const FIELDS: FieldConfig[] = [
  {
    name: 'failureDescription',
    label: 'Descripción',
    type: 'text',
    required: true,
    minLength: 3,
  },
  {
    name: 'estimatedImport',
    label: 'Importe Estimado',
    type: 'number',
    required: true,
    min: 0,
    step: 0.01,
  },
];

interface ModificacionTipoFallaProps {
  onSuccess?: () => void;
}

export default function ModificacionTipoFalla({ onSuccess }: ModificacionTipoFallaProps) {
  return (
    <ModForm<FailureType>
      title="Modificar Tipo de Falla"
      subtitle="Buscá el tipo de falla que querés editar"
      searchPlaceholder="Buscar tipo de falla..."
      searchEndpoint="/failures/getPartialTypes"
      modifyEndpoint="/failures/modifyType"
      idField="id_failure_type"
      previewField="failureDescription"
      fields={FIELDS}
      entityEvent={EVENTS.failureTypeChanged}
      successMessage="Tipo de falla modificado correctamente."
      onSuccess={onSuccess}
    />
  );
}