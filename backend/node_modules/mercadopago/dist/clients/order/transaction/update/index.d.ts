import { OrderUpdateTransactionClient } from './types';
import { PaymentApiResponse } from '../../commonTypes';
export default function updateTransaction({ id, transactionId, body, config }: OrderUpdateTransactionClient): Promise<PaymentApiResponse>;
