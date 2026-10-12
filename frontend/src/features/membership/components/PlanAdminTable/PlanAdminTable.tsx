// Tabla de planes de membresía del panel de administración: muestra cada plan con
// su precio y cuántas suscripciones tiene, más el botón para cambiar el precio,
// que es lo único editable de un plan.
//
// Solo define sus columnas: el armado de la tabla (wrapper con scroll, cabecera,
// filas) lo pone DataTable, el mismo que usan las tablas de géneros y usuarios.
//
// Es presentacional: no llama a la API ni guarda estado propio; avisa al padre
// (PlanAdminSection) con el handler que recibe.
import { Pencil } from 'lucide-react';
import { Badge } from '../../../../core/components/Badge';
import { DataTable } from '../../../../core/components/DataTable';
import type { DataTableColumn } from '../../../../core/components/DataTable';
import { IconButton } from '../../../../core/components/IconButton';
import type { Plan } from '../../models/Membership';
import './PlanAdminTable.scss';

type PlanAdminTableProps = {
  plans: Plan[];
  onEditPrice: (plan: Plan) => void;
};

export const PlanAdminTable = ({ plans, onEditPrice }: PlanAdminTableProps) => {
  const columns: DataTableColumn<Plan>[] = [
    {
      key: 'name',
      header: 'Plan',
      render: (plan) => (
        <div className="plan-admin__name-cell">
          <span className="data-table__name-cell">{plan.name}</span>
          <Badge tone={plan.isPaid ? 'info' : 'neutral'}>
            {plan.isPaid ? 'Pago' : 'Gratuito'}
          </Badge>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Precio',
      render: (plan) => plan.priceLabel,
    },
    {
      key: 'subscribers',
      header: 'Suscripciones',
      render: (plan) => plan.subscribers,
    },
    {
      key: 'actions',
      header: 'Acciones',
      // El plan gratuito no tiene precio que cambiar: ponerle uno lo convertiría
      // en otro plan pago, y la API lo rechaza.
      render: (plan) =>
        plan.isPaid ? (
          <div className="data-table__actions">
            <IconButton
              icon={<Pencil size={16} aria-hidden="true" />}
              label="Cambiar precio"
              onClick={() => onEditPrice(plan)}
            />
          </div>
        ) : null,
    },
  ];

  return <DataTable columns={columns} rows={plans} getRowKey={(plan) => plan.id} />;
};
