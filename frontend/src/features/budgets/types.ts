import type { BaseQuery } from '@/types/pagination';
import type { EnumBudgetStatus } from '@/types/types';
import type { AddedCost } from '@/features/addedCosts/types';
import type { Payment } from '@/features/payments/types';

export interface Budget {
  id_budget: string;
  nroBudget: number;
  id_order: string;
  laborCost: number | string;
  discount: number | string;
  status: EnumBudgetStatus;
  budgetDate: string;
  clientSuggestion?: string | null;
  estimatedTotal?: number; // lo agrega toJSON() del backend cuando hay relaciones
  addedCosts?: AddedCost[];
  payments?: Payment[];
  order?: unknown; // tipalo con Order si lo necesitás (cuidado con import circular)
}

export interface CreateBudgetDto {
  id_order: string;
  laborCost: number;
  discount?: number;
}

export interface UpdateBudgetDto {
  laborCost?: number;
  discount?: number;
  status?: EnumBudgetStatus;
}

export interface BudgetsQuery extends BaseQuery {
  sortBy?: 'laborCost' | 'estimatedTotal' | 'status';
}

// Respuesta pública del cliente (link por mail)
export type BudgetDecision = 'approved' | 'rejected' | 'suggestion';
export interface BudgetRespondDto {
  decision: BudgetDecision;
  client_suggestion?: string; // obligatorio si decision === 'suggestion'
}
