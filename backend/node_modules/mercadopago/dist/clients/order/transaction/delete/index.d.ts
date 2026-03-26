import { OrderDeleteTransactionClient } from './types';
import { ApiResponse } from '../../../../types';
export default function deleteTransaction({ id, transactionId, config }: OrderDeleteTransactionClient): Promise<ApiResponse>;
