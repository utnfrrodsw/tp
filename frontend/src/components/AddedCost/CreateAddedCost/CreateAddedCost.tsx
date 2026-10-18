import { EVENTS } from "@/lib/eventBus";
import { type FieldConfig} from "@/pages/CRUDS/Alta/AltaForm";
import AltaForm from "@/pages/CRUDS/Alta/AltaForm";
import type { Budget } from "@/types/types";

const getFields = (budget: Budget): FieldConfig[] => [
  {
    name: 'type_addedCost',
    label: 'Tipo de Costo Agregado',
    type: 'select',
    options: [
      {
        value: 'repuesto',
        label: 'Repuesto',
      },
      {
        value: 'procedimientoEspecial',
        label: 'Procedimiento Especial',
      },
      {
        value: 'garantia',
        label: 'Garantía',
      },
      {
        value: 'reparacionExpress',
        label: 'Reparación Express',
      },
      {
        value: 'limpiezaPuestaAPunto',
        label: 'Limpieza / Punto a Punto',
      },
      {
        value: 'serviciosSoftware',
        label: 'Servicios de Software',
      },
    ],
    placeholder: 'Elegí el tipo del costo agregado',
    required: true,
  },
  {
    name: 'addedCostDescription',
    label: 'Descripción del Costo Agregado',
    type: 'text',
    placeholder: 'Podés indicar: el procedimiento, el repuesto adquirido, etc.',
    required: true,
    minLength: 5,
  },
  {
    name: 'addedCostAmount',
    label: 'Monto del Costo',
    type: 'number',
    placeholder: '0.00',
    required: true,
    prefix: '$',
    min: 0,
    step: 0.01,
  },
  {
    name: 'id_budget',
    label: '',
    type: 'hidden',
    defaultValue: budget.id_budget,
  },
];
interface CreateAddedCostProps {
    budget: Budget;
    onSuccess?:()=>void;
}
export default function CreateAddedCost({onSuccess, budget}:CreateAddedCostProps){
    return(
        <AltaForm
        method="POST"
        title={`Creando un Costo agregado para el presupuesto: ${budget.nroBudget}`}
        subtitle="Completa la informacion para registrar un costo agregado"
        fields={getFields(budget)}
        endpoint="/api/added-cost/"
        submitLabel="Crear Costo Agregado"
        successMessage="Costo Agregado Creado exitosamente"
        entityEvent={EVENTS.addedCostChanged}
        onSuccess={onSuccess}
        />
    )
}
