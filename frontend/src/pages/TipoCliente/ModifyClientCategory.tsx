import ModForm from './../CRUDS/Modify/ModForm';
import type { FieldConfig } from './../CRUDS/Alta/AltaForm';
import { EVENTS } from '../../lib/eventBus';
import type { Client_Type } from '@/types/types';


const FIELDS: FieldConfig[] = [
  {
    name: 'clientTypeName',
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
    required: true,
  },
];

interface ModifyClientCategoryProps {
  onSuccess?: () => void;
}

export default function ModifyClientCategory({ onSuccess }: ModifyClientCategoryProps) {
  return (
    <ModForm<Client_Type>
      title="Modificar Categoria de Cliente"
      subtitle="Buscá la categoría de cliente que querés editar"
      searchPlaceholder="Buscar categoría de cliente..."
      searchEndpoint="/api/client-types"
      modifyEndpoint="/api/client-types"
      idField="id_client_type"
      previewField="clientTypeName"
      fields={FIELDS}
      entityEvent={EVENTS.clientCategoryChanged}
      successMessage="Categoria de cliente modificada correctamente."
      onSuccess={onSuccess}
    />
  );
}