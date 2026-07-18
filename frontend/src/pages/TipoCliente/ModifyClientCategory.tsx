import ModForm from './../CRUDS/Modify/ModForm';
import type { FieldConfig } from './../CRUDS/Alta/AltaForm';
import { EVENTS } from '../../lib/eventBus';

interface ClientCategory {
  id_category_client: number;
  categoryClientName: string;
  amountForCategoryUp: number;
}

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
    required: true,
  },
];

interface ModifyClientCategoryProps {
  onSuccess?: () => void;
}

export default function ModifyClientCategory({ onSuccess }: ModifyClientCategoryProps) {
  return (
    <ModForm<ClientCategory>
        title="Modificar Categoria de Cliente"
        subtitle="Buscá la categoría de cliente que querés editar"
        searchPlaceholder="Buscar categoría de cliente..."
        searchEndpoint="/clients/getPartialCategoryClients"
        modifyEndpoint="/clients/modifyCategoryClient"
        idField="id_category_client"
        previewField="categoryClientName"
        fields={FIELDS}
        entityEvent={EVENTS.clientCategoryChanged}
        successMessage="Categoria de cliente modificada correctamente."
        onSuccess={onSuccess}
    />
  );
}