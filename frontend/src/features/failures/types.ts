import type { EnumFailureStatus } from '@/types/types';
import type { FailureType } from '@/features/failureTypes/types';

export interface Failure {
  id_failure: string;
  id_failure_type: string;
  id_order: string;
  description: string;
  dateOfFailure: string;
  status: EnumFailureStatus;
  failureType?: FailureType;
}

export interface CreateFailureItemDto {
  id_failure_type: string;
  failureDescription: string;
  id_order: string;
}
export type CreateFailuresDto = CreateFailureItemDto[]; // el backend espera un array

// Ojo: el backend exige AMBOS campos en el PUT
export interface UpdateFailureDto {
  id_failure_type: string;
  description: string;
}

export interface CreateFailuresResponse { message: string; failures: Failure[] }
export interface UpdateFailureResponse { message: string; failure: Failure }
export interface DeleteFailureResponse { message: string; res: Failure }
export interface TotalResponse { total: number }
