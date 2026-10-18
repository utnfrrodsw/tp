import type { BaseQuery } from '@/types/pagination';
import type { PaymentType } from '@/features/paymentTypes/types';

export interface Payment {
  id_payment: string;
  id_payment_type: string;
  id_budget: string;
  dateOfPayment: string;
  amount: number | string;
  paymentType?: PaymentType;
}

export interface CreatePaymentDto {
  id_budget: string;
  id_payment_type: string;
  amount: number;
}

export interface PaymentsQuery extends BaseQuery {
  sortBy?: 'amount' | 'dateOfPayment';
}
