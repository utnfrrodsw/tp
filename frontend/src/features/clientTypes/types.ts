import type { BaseQuery } from '@/types/pagination';

export interface ClientType {
  clientTypeName: string,
  amountForCategoryUp: number,
  id_client_type: string,
}

export interface CreateClientTypeDto {
  clientTypeName: string,
  amountForCategoryUp: number,
}

export type UpdateClientTypeDto = Partial<CreateClientTypeDto>;

export interface ClientTypeQuery extends BaseQuery {
  sortBy: "clientTypeName" |  "amountForCategoryUp" |  "id_client_type"
}