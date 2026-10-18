import { DateFilter, SelectFilter } from '@/components/Filters';
import { useClientTypeOptions } from '@/features/clientTypes/useClientTypeOptions';
import { UserRoundPlus, X } from 'lucide-react';
import ClientRegister from '@/features/clients/components/ClientRegister/ClientRegister';
import type { ClientsQuery } from '../../clients/types';
import { clientsService } from '../../clients/clients.service';
import type { Client } from '../../clients/types';
import { EntityManagement, type EntityConfig, type FiltersProps } from '@/components/EntityManagement/EntityManagement';
import { EVENTS } from '@/lib/eventBus';
import ClientDetailModal from '../components/ClientCard/ClientDetailModal/ClientDetailModal';
import { useState } from 'react';
import { QUERY_KEYS } from '@/lib/queryKeys';
import styles from './ClientsManagement.module.css';


const ClientFilters = ({ query, updateQuery }: FiltersProps<ClientsQuery>) => {
  const { options } = useClientTypeOptions();

  return (
    <>
      <SelectFilter
        label="Tipo de cliente"
        value={query.id_client_type}
        onChange={(v) => updateQuery({ id_client_type: v })}
        options={options}
      />
      <DateFilter
        label="Registrado desde"
        value={query.dateFrom}
        onChange={(v) => updateQuery({ dateFrom: v })}
      />
      <DateFilter
        label="Registrado hasta"
        value={query.dateTo}
        onChange={(v) => updateQuery({ dateTo: v })}
      />
    </>
  );
};

const ClientsManagement = () => {
  const [detail, setDetail] = useState<{ client: Client; clearSelection: () => void } | null>(null);
  const [isClientRegisterOpen, setIsClientRegisterOpen] = useState(false);

  const { options } = useClientTypeOptions();

  const clientsConfig: EntityConfig<Client, ClientsQuery> = {
    title: 'Clientes',
    queryKey: QUERY_KEYS.clients,
    queryFn: clientsService.getAll,
    idField: 'id_client',
    columns: [
      { key: 'clientName', label: 'Nombre' },
      { key: 'clientEmail', label: 'Email' },
      { key: 'clientPhone', label: 'Teléfono' },
      {
        key: 'dateOfRegistration',
        label: 'Fecha de registro',
        format: (value) =>
          new Date(value as string | Date).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
      },
      { key: 'cuit', label: 'CUIT' },
      {
        key: 'status', label: 'Estado', render: (c) => (c.status === false ? 'Baja' : 'Activo')
      },
      {
        key: 'id_client_type',
        label: 'Tipo de cliente',
        format: (value) => options.find((o) => o.value === value)?.label ?? 'sin tipo',
      },
    ],
    actions: [
      { label: 'Crear', icon: UserRoundPlus, variant: 'primary', onClick: () => setIsClientRegisterOpen(true) },

    ],
    card: { titleField: 'clientName', descriptionField: 'clientEmail' },
    searchPlaceholder: 'Buscar por nombre...',
    filterKeys: ['id_client_type', 'dateFrom', 'dateTo'],
    initialQuery: { page: 1, limit: 10 },
    onItemClick: (client, { clearSelection }) => setDetail({ client, clearSelection }),
  };

  return (
    <>
      <EntityManagement
        config={clientsConfig}
        Filters={ClientFilters}
      />
      {detail && (
        <ClientDetailModal
          client={detail.client}
          open={true}
          onClose={() => {
            detail.clearSelection();
            setDetail(null);
          }}
          entityEvent={EVENTS.clientChanged}
        />
      )}
      {isClientRegisterOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsClientRegisterOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.closeModalButton}
              onClick={() => setIsClientRegisterOpen(false)}
              aria-label="Cerrar modal"
              title="Cerrar"
            >
              <X size={20} aria-hidden="true" />
            </button>
            <ClientRegister onSuccess={() => setIsClientRegisterOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default ClientsManagement;