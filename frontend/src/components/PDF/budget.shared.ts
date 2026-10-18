import type {
  EnumBudgetStatus,
  EnumEquipmentType,
  EnumTypeAddedCost,
} from '@/types/types';
import type { BudgetWithRelations } from './BudgetPDFDocument';

export const STATUS_LABEL: Record<EnumBudgetStatus, string> = {
  pendiente: 'Pendiente',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
};

export const EQUIPMENT_LABEL: Record<EnumEquipmentType, string> = {
  celular: 'Celular',
  computadora: 'Computadora',
  tablet: 'Tablet',
  consola: 'Consola',
  notebook: 'Notebook',
  impresora: 'Impresora',
  televisor: 'Televisor',
  otro: 'Otro',
};

export const ADDED_COST_LABEL: Record<EnumTypeAddedCost, string> = {
  repuesto: 'Repuesto',
  procedimientoEspecial: 'Procedimiento especial',
  garantia: 'Garantía',
  reparacionExpress: 'Reparación express',
  limpiezaPuestaAPunto: 'Limpieza y puesta a punto',
  serviciosSoftware: 'Servicios de software',
};

export function formatDate(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function pad(n: number) {
  return String(n).padStart(6, '0');
}

export function calcBudgetTotal(budget: BudgetWithRelations) {
  const labor = Number(budget.laborCost) || 0;
  const discount = Number(budget.discount) || 0;
  const failures = budget.order.failures.reduce(
    (acc, f) => acc + (Number(f.failureType?.estimatedImport) || 0),
    0
  );
  const added = budget.addedCosts.reduce((acc, c) => acc + (Number(c.addedCostAmount) || 0), 0);

  return Math.max(0, labor + failures + added - discount);
}