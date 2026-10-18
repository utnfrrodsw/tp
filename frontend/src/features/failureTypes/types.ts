import type { BaseQuery } from '@/types/pagination';

export interface FailureType {
  id_failure_type: string;
  failureDescription: string;
  estimatedImport: number | string; // Prisma Decimal llega como string en JSON
}

export interface CreateFailureTypeDto {
  failureDescription: string;
  estimatedImport: number;
}
export type UpdateFailureTypeDto = Partial<CreateFailureTypeDto>;

export interface FailureTypesQuery extends BaseQuery {
  sortBy?: 'failureDescription' | 'estimatedImport' | 'id_failure_type';
}
