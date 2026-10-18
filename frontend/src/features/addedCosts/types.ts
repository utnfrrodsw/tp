import type { BaseQuery } from '@/types/pagination';
import type { EnumTypeAddedCost } from '@/types/types';

export interface AddedCost {
  id_addedCost: string;
  id_budget: string;
  type_addedCost: EnumTypeAddedCost;
  addedCostDescription: string;
  addedCostAmount: number | string;
}

export interface CreateAddedCostDto {
  id_budget: string;
  type_addedCost: EnumTypeAddedCost;
  addedCostDescription: string;
  addedCostAmount: number;
}
export type UpdateAddedCostDto = Partial<Omit<CreateAddedCostDto, 'id_budget'>>;

export interface AddedCostsQuery extends BaseQuery {
  sortBy?: 'addedCostAmount' | 'addedCostDescription' | 'type_addedCost';
}

export interface TotalResponse { total: number }
