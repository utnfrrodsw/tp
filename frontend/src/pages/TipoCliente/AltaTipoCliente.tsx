import AltaForm from './../CRUDS/Alta/AltaForm';
import type { FieldConfig } from './../CRUDS/Alta/AltaForm';
import { EVENTS } from '../../lib/eventBus';

// Ajustá los campos que necesites para tu entidad Client
const FIELDS: FieldConfig[] = [
  {
    name: 'categoryClientName',
    label: 'Nombre/Descripcion',
    type: 'text',
    placeholder: 'Ej: Normal, Premium...',
    required: true,
    minLength: 2,
  },
  {
    name: 'amountForCategoryUp',
    label: 'Cantidad de ordenes para subir a esta categoria:',
    type: 'number',
    placeholder: '1, 5, 10...',
    required: true,
  },
];

const ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

interface AltaCategoryClientProps {
  onSuccess?: () => void;
}

export default function AltaCategoryClient({ onSuccess }: AltaCategoryClientProps) {
  return (
    <AltaForm
      title="Nueva Categoria de Cliente"
      subtitle="Completá los datos para registrar la Categoria de cliente"
      icon={ICON}
      fields={FIELDS}
      endpoint="/clients/createCategoryClient"
      submitLabel="Crear Categoria de Cliente"
      successMessage="Categoria Cliente creada correctamente."
      entityEvent={EVENTS.clientCategoryChanged}  
      onSuccess={onSuccess}
      
    />
  );
}