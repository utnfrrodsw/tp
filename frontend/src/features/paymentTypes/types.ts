import type { BaseQuery } from '@/types/pagination';
import type { EnumPaymentMethod, EnumPaymentType } from '@/types/types';

export interface PaymentType {
  id_payment_type: string;
  paymentTypeName: string;
  paymentMethod: EnumPaymentMethod;
  type_of_payment: EnumPaymentType;
  percentage: number | string;
}

export interface CreatePaymentTypeDto {
  paymentTypeName: string;
  paymentMethod: EnumPaymentMethod;
  type_of_payment: EnumPaymentType;
  percentage: number;
}
export type UpdatePaymentTypeDto = Partial<CreatePaymentTypeDto>;

export interface PaymentTypesQuery extends BaseQuery {
  sortBy?: 'paymentTypeName' | 'paymentMethod' | 'type_of_payment' | 'id_payment_type' | 'percentage';
}
