import BajaForm from "../CRUDS/Baja/BajaForm";
import type { DetailFieldConfig } from "../CRUDS/Baja/BajaForm";
import { EVENTS } from "../../lib/eventBus";

interface ClientCategory {
  id_category_client: number;
  categoryClientName: string;
  amountForCategoryUp: number;
}
const FIELDS: DetailFieldConfig[] = [
  {
    name: "categoryClientName",
    label: "Nombre",
  },
    {
    name: "amountForCategoryUp",
    label: "Órdenes requeridas",
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
interface BajaClientCategoryProps {
  onSuccess?: () => void;
}

export default function BajaClientCategory({ onSuccess }: BajaClientCategoryProps) {
  return (
    <BajaForm<ClientCategory>
        title="Eliminar Categoría de Cliente"
        subtitle="Buscá la categoría de cliente que querés eliminar"
        searchPlaceholder="Busca tu categoría de cliente por descripción..."
        searchEndpoint="/clients/getPartialCategoryClients"
        deleteEndpoint="/clients/deleteCategoryClient"
        entityEvent={EVENTS.clientCategoryChanged}
        successMessage="Categoría de cliente eliminada correctamente."
        icon={ICON}
        detailFields={FIELDS}
        idField="id_category_client"
        previewField="categoryClientName"
        onSuccess={onSuccess}
    />
  );
}