import { renderToBuffer } from '@react-pdf/renderer';
import BudgetPdfDocument, { type BudgetWithRelations } from './BudgetPdfDocument.js';
import type { Budget as BudgetEntity } from '@/modules/budgets/budget.entity.js';

export function assertBudgetWithRelations(
  budget: BudgetEntity
): asserts budget is BudgetWithRelations {
  if (
    !budget.id_budget ||
    budget.nroBudget === undefined ||
    budget.discount === undefined ||
    !budget.status ||
    !budget.budgetDate ||
    !budget.order ||
    !budget.addedCosts
  ) {
    throw new Error(
      `Budget incompleto para generar PDF (id_order: ${budget.id_order}). ` +
      `Verificá que budgetInclude en BudgetRepository incluya order y addedCosts.`
    );
  }
}
export async function renderBudgetPdf(budget: BudgetWithRelations): Promise<Buffer> {
    return renderToBuffer(<BudgetPdfDocument budget={budget} />);
}